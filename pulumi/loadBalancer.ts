import * as aws from "@pulumi/aws";
import type { Output } from "@pulumi/pulumi/output";

export const createLoadBalancer = ({
  vpcId,
  securityGroupId,
  serverIds,
  subnetIds,
}: {
  vpcId: Output<string>;
  securityGroupId: Output<string>;
  subnetIds: Output<string>[];
  serverIds: Output<string>[];
}) => {
  const loadBalancer = new aws.lb.LoadBalancer("load_balancer", {
    name: "load-balancer",
    internal: false,
    loadBalancerType: "application",
    securityGroups: [securityGroupId],
    subnets: subnetIds,
    enableDeletionProtection: false,
  });

  const loadBalancerTargetGroup = new aws.lb.TargetGroup(
    "lb_target_group",
    {
      name: "lb-target-group",
      targetType: "instance",
      port: 80,
      protocol: "HTTP",
      vpcId: vpcId,
      healthCheck: {
        path: "/",
        interval: 30,
        timeout: 5,
        healthyThreshold: 3,
        unhealthyThreshold: 3,
      },
    },
    { dependsOn: [loadBalancer] }
  );

  const loadBalancerListener = new aws.lb.Listener("lb_listener", {
    loadBalancerArn: loadBalancer.arn,
    port: 80,
    protocol: "HTTP",
    defaultActions: [
      {
        type: "forward",
        targetGroupArn: loadBalancerTargetGroup.arn,
      },
    ],
  });

  const targetGroupAttachment = serverIds.map(
    (serverId, i) =>
      new aws.lb.TargetGroupAttachment(`attachment-${i}`, {
        targetGroupArn: loadBalancerTargetGroup.arn,
        targetId: serverId,
        port: 80,
      })
  );

  return loadBalancer;
};
