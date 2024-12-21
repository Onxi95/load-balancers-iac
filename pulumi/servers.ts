import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import type { Output } from "@pulumi/pulumi";

const config = new pulumi.Config();
const instanceType = config.get("instanceType") || "t2.micro";

type InstanceConfig = {
  name: string;
  httpMessage: string;
  subnetId: Output<string>;
};

export const createServers = ({
  securityGroupId,
  instanceConfig,
}: {
  securityGroupId: Output<string>;
  instanceConfig: InstanceConfig[];
}) => {
  const servers = instanceConfig.map(
    ({ name, httpMessage, subnetId }) =>
      new aws.ec2.Instance(name, {
        instanceType: instanceType,
        subnetId,
        vpcSecurityGroupIds: [securityGroupId],
        userData: `#!/bin/bash
                yum install -y httpd
                systemctl start httpd
                systemctl enable httpd
                echo "${httpMessage}" > /var/www/html/index.html
      `,
        ami: "ami-0453ec754f44f9a4a",
      })
  );
  return servers;
};
