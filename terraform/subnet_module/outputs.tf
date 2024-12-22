output "subnet_ids" {
  description = "The IDs of the created subnets"
  value       = { for k, subnet in aws_subnet.public : k => subnet.id }
}
