# Deploy a Dockerized Node.js App to AWS ECS with GitHub Actions and Terraform

This guide walks through building, packaging, and deploying a Dockerized Node.js app to AWS ECS using Terraform for infrastructure and GitHub Actions for CI/CD.

## Prerequisites

- AWS account with IAM permissions
- GitHub repository
- Dockerfile at project root
- AWS CLI and Terraform installed locally for testing

## High-level flow

1. Build Docker image and push to Amazon ECR
2. Use Terraform to provision VPC, ECS cluster, task definition, service, and IAM roles
3. Trigger GitHub Actions workflow to run tests, build, push, and apply Terraform

## Example Terraform structure

- terraform/
  - main.tf
  - variables.tf
  - outputs.tf

Sample task definition snippet (task_definition.tf):

```hcl
resource "aws_ecs_task_definition" "app" {
  family                   = "app-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "app"
      image     = "${aws_ecr_repository.app.repository_url}:latest"
      portMappings = [{ containerPort = 3000, protocol = "tcp" }]
    }
  ])
}
```

## GitHub Actions workflow (simplified)

Create .github/workflows/deploy.yml:

```yaml
name: CI/CD
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push image
        run: |
          IMAGE_TAG=${{ github.sha }}
          docker build -t $ECR_REPO_URI:$IMAGE_TAG .
          docker push $ECR_REPO_URI:$IMAGE_TAG
        env:
          ECR_REPO_URI: ${{ secrets.ECR_REPO_URI }}

      - name: Terraform Init
        run: |
          cd terraform
          terraform init

      - name: Terraform Apply
        run: |
          cd terraform
          terraform apply -auto-approve
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

Notes:
- Use Terraform workspaces or separate state per environment
- Store sensitive values in GitHub Secrets and use least-privilege IAM roles
- Consider using terraform plan + PR review in a protected workflow

## Zero-downtime deploys

Implement rolling updates via ECS service deployments; for critical apps consider blue/green strategies with an Application Load Balancer.

## Rollback strategy

- Keep previous stable image tags
- Use ECS service deployment configuration to control minimum healthy percent
- Automate rollback in Actions on health-check failures

## Resources

- Full sample repo: (link placeholder)
- Terraform AWS provider docs
- GitHub Actions official docs

---

If you want, I can add a complete sample repo structure and a ready-to-run GitHub Actions + Terraform example tailored to your repo layout.
