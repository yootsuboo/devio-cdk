import * as cdk from "@aws-cdk/core";
import { Vpc } from "./resource/vpc";
import { Subnet } from "./resource/subnet";
import { InternetGateway } from "./resource/internetGateway";
import { ElasticIp } from "./resource/elasticIp";
import { NatGateway } from "./resource/natGateway";
import { RouteTable } from "./resource/routeTable";
import { NetworkAcl } from "./resource/networkAcl";
import { IamRole } from "./resource/iamRole";
import { SecurityGroup } from "./resource/securityGroup";

export class DevioStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc();
    vpc.createResources(this);

    const subnet = new Subnet(vpc.vpc);
    subnet.createResources(this);
    
    const internetGateway = new InternetGateway(vpc.vpc);
    internetGateway.createResources(this);
    
    const elasticIp = new ElasticIp();
    elasticIp.createResources(this);
    
    const natGateway = new NatGateway(
      subnet.public1a,
      subnet.public1c,
      elasticIp.ngw1a,
      elasticIp.ngw1c,
    );
    natGateway.createResources(this)
    
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
      subnet.db1c,
    );
    networkAcl.createResources(this);
    
    const iamRole = new IamRole();
    iamRole.createResources(this);
    
    const securityGroup = new SecurityGroup(vpc.vpc);
    securityGroup.createResources(this);
  }
}
