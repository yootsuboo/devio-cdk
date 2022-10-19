import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Vpc } from "./resource/vpc";
import { Subnet } from "./resource/subnet";
import { InternetGateway } from "./resource/internetGateway";
import { ElasticIp } from "./resource/elasticIp";
import { NatGateway } from "./resource/natGateway";
import { RouteTable } from "./resource/routeTable";
import { NetworkAcl } from "./resource/networkAcl";
import { IamRole } from "./resource/iamRole";
import { SecurityGroup } from "./resource/securityGroup";
import { Ec2 } from "./resource/ec2";
import { Alb } from "./resource/alb";
import { SecretsManager } from "./resource/secretsManager";
import { Rds } from "./resource/rds";

export class DevioStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc();
    vpc.createResources(this);

    const subnet = new Subnet(vpc.vpc);
    subnet.createResources(this);
    
    // デバック用にログ出力する設定
    // cdk synth --quiet
    // console.log(`subnet.public1a.cidrBlock = ${subnet.public1a.cidrBlock}`);

    const internetGateway = new InternetGateway(vpc.vpc);
    internetGateway.createResources(this);

    const elasticIp = new ElasticIp();
    elasticIp.createResources(this);

    const natGateway = new NatGateway(
      subnet.public1a,
      subnet.public1c,
      elasticIp.ngw1a,
      elasticIp.ngw1c
    );
    natGateway.createResources(this);

    const routeTable = new RouteTable(
      vpc.vpc,
      subnet.public1a,
      subnet.public1c,
      subnet.app1a,
      subnet.app1c,
      subnet.db1a,
      subnet.db1c,
      internetGateway.igw,
      natGateway.ngw1a,
      natGateway.ngw1c
    );
    routeTable.createResources(this);

    const networkAcl = new NetworkAcl(
      vpc.vpc,
      subnet.public1a,
      subnet.public1c,
      subnet.app1a,
      subnet.app1c,
      subnet.db1a,
      subnet.db1c
    );
    networkAcl.createResources(this);

    const iamRole = new IamRole();
    iamRole.createResources(this);

    const securityGroup = new SecurityGroup(vpc.vpc);
    securityGroup.createResources(this);

    const ec2 = new Ec2(
      subnet.app1a,
      subnet.app1c,
      iamRole.instanceProfileEc2,
      securityGroup.ec2
    );
    ec2.createResources(this);

    const alb = new Alb(
      vpc.vpc,
      subnet.public1a,
      subnet.public1c,
      securityGroup.alb,
      ec2.instance1a,
      ec2.instance1c
    );
    alb.createResources(this);

    const secretsManager = new SecretsManager();
    secretsManager.createResources(this);

    const rds = new Rds(
      subnet.db1a,
      subnet.db1c,
      securityGroup.rds,
      secretsManager.secretRdsCluster,
      iamRole.rds
    );
    rds.createResources(this);
  }
}
