import { Construct } from "constructs";

// ここは何をやっている?
// abstruct とは?
export abstract class BaseResource {
  constructor() { }

  // protectedを使用することで、参照先でも使用できるようになる
  protected createResourceName(
    scope: Construct,
    originalName: string
  ): string {
    const systemName = scope.node.tryGetContext("systemName");
    const envType = scope.node.tryGetContext("envType");
    const resourceNamePrefix = `${systemName}-${envType}-`;

    return `${resourceNamePrefix}${originalName}`;
  }
}
