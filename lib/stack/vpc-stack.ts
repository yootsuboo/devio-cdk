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
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const vpc = new Vpc(this);

        const subnet = new Subnet(this, vpc);

        const internetGateway = new InternetGateway(this, vpc);

        const elasticIp = new ElasticIp(this);

        const natGateway = new NatGateway(this, subnet, elasticIp);

        // constで変数にしないのは、おそらくどこからも参照されないから??
        new RouteTable(this, vpc, subnet, internetGateway, natGateway);
        
        new NetworkAcl(this, vpc, subnet);
    }
}