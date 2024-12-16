import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { securityGroup } from "./securityGroup";
import { subnets } from "./subnets";

const config = new pulumi.Config();
const instanceType = config.get("instanceType") || "t2.micro";

const instances = [
  { name: "a", message: "Hello from instance 1", subnetId: subnets[0].id },
  { name: "b", message: "Hello from instance 2", subnetId: subnets[1].id },
] as const;

export const servers = instances.map(
  ({ name, message, subnetId }) =>
    new aws.ec2.Instance(name, {
      instanceType: instanceType,
      subnetId,
      vpcSecurityGroupIds: [securityGroup.id],
      userData: `#!/bin/bash
                sudo su
                yum install -y httpd
                systemctl start httpd
                systemctl enable httpd
                echo "${message}" > /var/www/html/index.html
      `,
      ami: "ami-0453ec754f44f9a4a",
    })
);
