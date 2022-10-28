# AWS CDK for TypeScript

**DevelopersIO 実践!AWS CDK** シリーズをもとに構築

# Usage

1. CloudFormation のテンプレートの作成

    ``` bash
    $ cdk synth
    ```

1. スタック一覧表示

    ``` bash
    $ cdk ls
    ```

1. スタック単体でのデプロイ

    ``` bash
    $ cdk deploy <stackName>
    ```

1. スタック全体でのデプロイ

    ``` bash
    $ cdk deploy --all
    ```

1. スタックの削除(リソースの削除)

    ``` bash
    $ cdk destroy --all
    ```

# Environment

| 環境 | バージョン |
| --- | --- |
| macOS | 12.6 |
| VS Code | 1.72.2 |
| AWS CLI | 2.1.24 |
| AWS CDK | 2.47.0 |
| TypeScript | 4.8.4 |
| Node.js | v18.0.0 |
