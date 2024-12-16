import * as aws from "@pulumi/aws";
import { securityGroup } from "./securityGroup";
import { subnets } from "./subnets";
import { vpc } from "./vpc";
import { servers } from "./servers";

export const loadBalancer = new aws.lb.LoadBalancer("load_balancer", {
  name: "load-balancer",
  internal: false,
  loadBalancerType: "application",
  securityGroups: [securityGroup.id],
  subnets: subnets.map((subnet) => subnet.id),
  enableDeletionProtection: false,
});

const loadBalancerTargetGroup = new aws.lb.TargetGroup(
  "lb_target_group",
  {
    name: "lb-target-group",
    targetType: "instance",
    port: 80,
    protocol: "HTTP",
    vpcId: vpc.id,
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

const targetGroupAttachment = servers.map(
  (server, i) =>
    new aws.lb.TargetGroupAttachment(`attachment-${i}`, {
      targetGroupArn: loadBalancerTargetGroup.arn,
      targetId: server.id,
      port: 80,
    })
);
