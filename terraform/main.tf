provider "aws" {
  region = "us-east-1"
}

output "load_balancer_dns" {
  value = aws_lb.load_balancer.dns_name
}