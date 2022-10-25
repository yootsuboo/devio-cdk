import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Ec2Stack } from "./stack/ec2-stack";
import { IamStack } from "./stack/iam-stack";
import { SecretsManagerStack } from "./stack/secrets-manager-stack";
import { VpcStack } from "./stack/vpc-stack";

export class DevioStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    //VPC Stack
    const vpcStack =new VpcStack(scope, "VpcStack", {
      stackName: this.createStackName(scope, "vpc")
    });
    
    const iamStack = new IamStack(scope, "IamStack", {
      stackName: this.createStackName(scope, "iam")
    });
    
    new Ec2Stack(scope, "Ec2Stack", vpcStack, iamStack, {
      stackName: this.createStackName(scope, "ec2")
    });

    new SecretsManagerStack(scope, "SecretsManagerStack", {
      stackName: this.createStackName(scope, "secrets-manager")
    });
  }
  
  private createStackName(scope: Construct, originalName: string): string {
    const systemName = scope.node.tryGetContext("systemName");
    const envType = scope.node.tryGetContext("envType");
    const stackNamePrefix = `${systemName}-${envType}-stack-`;

    return `${stackNamePrefix}${originalName}`;
  }
}
