import { App } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { Ec2Stack } from "../../lib/stack/ec2-stack";
import { IamStack } from "../../lib/stack/iam-stack";
import { RdsStack } from "../../lib/stack/rds-stack";
import { SecretsManagerStack } from "../../lib/stack/secrets-manager-stack";
import { VpcStack } from "../../lib/stack/vpc-stack";

test("Rds Stack", () => {
  const app = new App({
    context: {
        "systemName": "devio",
        "envType": "stg",
    }
  });
  const vpcStack = new VpcStack(app, "VpcStack");
  const iamStack = new IamStack(app, "IamStack");
  const ec2Stack = new Ec2Stack(app, "Ec2Stack", vpcStack, iamStack);
  const secretsManagerStack = new SecretsManagerStack(app, "SecretsManagerStack");
  const rdsStack = new RdsStack(app, "RdsStack", vpcStack, iamStack, ec2Stack, secretsManagerStack);
  const template = Template.fromStack(rdsStack);

  template.resourceCountIs("AWS::RDS::DBSubnetGroup", 1);
  template.hasResourceProperties("AWS::RDS::DBSubnetGroup", {
    DBSubnetGroupDescription: "Subnet Group for RDS",
    SubnetIds: Match.anyValue(),
    DBSubnetGroupName: "devio-stg-rds-sng",
  });

  template.resourceCountIs("AWS::RDS::DBClusterParameterGroup", 1);
  template.hasResourceProperties("AWS::RDS::DBClusterParameterGroup", {
    Description: "Cluster Parameter Group for RDS",
    Family: "aurora-mysql5.7",
    Parameters: { time_zone: "UTC" },
  });

  template.resourceCountIs("AWS::RDS::DBParameterGroup", 1);
  template.hasResourceProperties("AWS::RDS::DBParameterGroup", {
    Description: "Parameter Group for RDS",
    Family: "aurora-mysql5.7",
  });

  template.resourceCountIs("AWS::RDS::DBCluster", 1);
  template.hasResourceProperties("AWS::RDS::DBCluster", {
    Engine: "aurora-mysql",
    BackupRetentionPeriod: 7,
    DatabaseName: "devio",
    DBClusterIdentifier: "devio-stg-rds-cluster",
    DBClusterParameterGroupName: Match.anyValue(),
    DBSubnetGroupName: Match.anyValue(),
    EnableCloudwatchLogsExports: ["error"],
    EngineMode: "provisioned",
    EngineVersion: "5.7.mysql_aurora.2.11.0",
    MasterUsername: Match.anyValue(),
    MasterUserPassword: Match.anyValue(),
    Port: 3306,
    PreferredBackupWindow: "19:00-19:30",
    PreferredMaintenanceWindow: "sun:19:30-sun:20:00",
    StorageEncrypted: true,
    VpcSecurityGroupIds: Match.anyValue(),
  });

  template.resourceCountIs("AWS::RDS::DBInstance", 2);
  template.hasResourceProperties("AWS::RDS::DBInstance", {
    DBInstanceClass: "db.r5.large",
    AutoMinorVersionUpgrade: false,
    AvailabilityZone: "ap-northeast-1a",
    DBClusterIdentifier: Match.anyValue(),
    DBInstanceIdentifier: "devio-stg-rds-instance-1a",
    DBParameterGroupName: Match.anyValue(),
    DBSubnetGroupName: Match.anyValue(),
    EnablePerformanceInsights: true,
    Engine: "aurora-mysql",
    MonitoringInterval: 60,
    MonitoringRoleArn: Match.anyValue(),
    PerformanceInsightsRetentionPeriod: 7,
    PreferredMaintenanceWindow: "sun:20:00-sun:20:30",
  });
  template.hasResourceProperties("AWS::RDS::DBInstance", {
    DBInstanceClass: "db.r5.large",
    AutoMinorVersionUpgrade: false,
    AvailabilityZone: "ap-northeast-1c",
    DBClusterIdentifier: Match.anyValue(),
    DBInstanceIdentifier: "devio-stg-rds-instance-1c",
    DBParameterGroupName: Match.anyValue(),
    DBSubnetGroupName: Match.anyValue(),
    EnablePerformanceInsights: true,
    Engine: "aurora-mysql",
    MonitoringInterval: 60,
    MonitoringRoleArn: Match.anyValue(),
    PerformanceInsightsRetentionPeriod: 7,
    PreferredMaintenanceWindow: "sun:20:30-sun:21:00",
  });
});
