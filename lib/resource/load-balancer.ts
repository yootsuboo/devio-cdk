import { Construct } from "constructs";
import {
  CfnLoadBalancer,
  CfnListener,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { BaseResource } from "./abstract/base-resource";
import { SecurityGroup } from "./security-group";
import { Subnet } from "./subnet";
import { TargetGroup } from "./target-group";

export class LoadBalancer extends BaseResource {
  public readonly alb: CfnLoadBalancer;

  constructor(
    scope: Construct,
    securityGroup: SecurityGroup,
    subnet: Subnet,
    targetGroup: TargetGroup
  ) {
    super();

    this.alb = new CfnLoadBalancer(scope, "Alb", {
      ipAddressType: "ipv4",
      name: this.createResourceName(scope, "alb"),
      scheme: "internet-facing",
      securityGroups: [securityGroup.alb.attrGroupId],
      subnets: [subnet.public1a.ref, subnet.public1c.ref],
      type: "application",
    });

    new CfnListener(scope, "AlbListener", {
      defaultActions: [
        {
          type: "forward",
          forwardConfig: {
            targetGroups: [
              {
                targetGroupArn: targetGroup.tg.ref,
                weight: 1,
              },
            ],
          },
        },
      ],
      loadBalancerArn: this.alb.ref,
      port: 80,
      protocol: "HTTP",
    });
  }
}
