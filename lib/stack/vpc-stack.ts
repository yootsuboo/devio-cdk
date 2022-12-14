import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ElasticIp } from "../resource/elastic-ip";
import { InternetGateway } from "../resource/internet-gateway";
import { NatGateway } from "../resource/nat-gateway";
import { NetworkAcl } from "../resource/network-acl";
import { RouteTable } from "../resource/route-table";
import { Subnet } from "../resource/subnet";
import { Vpc } from "../resource/vpc";

export class VpcStack extends Stack {
    public readonly vpc: Vpc;
    public readonly subnet: Subnet;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.vpc = new Vpc(this);

        this.subnet = new Subnet(this, this.vpc);

        const internetGateway = new InternetGateway(this, this.vpc);

        const elasticIp = new ElasticIp(this);

        const natGateway = new NatGateway(this, this.subnet, elasticIp);

        // constで変数にしないのは、おそらくどこからも参照されないから??
        new RouteTable(this, this.vpc, this.subnet, internetGateway, natGateway);
        
        new NetworkAcl(this, this.vpc, this.subnet);
    }
}