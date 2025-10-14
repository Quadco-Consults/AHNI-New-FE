# Deployment Guide - AHNI Frontend

## Branch Structure

This project uses a three-tier deployment strategy:

- **`develop`** - Development branch (auto-deploys to development preview)
- **`staging`** - Staging branch (auto-deploys to staging environment)
- **`production`** - Production branch (auto-deploys to production environment)

## Setup Instructions

### 1. Push Branches to GitHub

The staging and production branches have been created locally. Push them to GitHub:

```bash
# Push staging branch
git push -u origin staging

# Push production branch
git push -u origin production
```

### 2. Vercel Deployment Setup

#### A. Initial Vercel Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository: `Quadco-Consults/AHNI-New-FE`
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)
   - **Install Command**: `npm install` (or leave default)

#### B. Create Multiple Deployments

You'll need to create 3 separate Vercel projects (or use environments):

##### Option 1: Three Separate Vercel Projects (Recommended)

**Staging Project:**
1. Import repository as new project
2. Name it: `ahni-frontend-staging`
3. In project settings → Git:
   - **Production Branch**: `staging`
   - Uncheck "Automatically deploy all branches"
4. Add staging environment variables (if different from production)
5. Custom domain (optional): `staging.yourapp.com`

**Production Project:**
1. Import repository as new project
2. Name it: `ahni-frontend-production`
3. In project settings → Git:
   - **Production Branch**: `production`
   - Uncheck "Automatically deploy all branches"
4. Add production environment variables
5. Custom domain: `yourapp.com` or `www.yourapp.com`

**Development Project (Optional):**
1. Import repository as new project
2. Name it: `ahni-frontend-dev`
3. In project settings → Git:
   - **Production Branch**: `develop`
   - Check "Automatically deploy all branches" for PR previews
4. Add development environment variables

##### Option 2: Single Project with Branch-Based Deployments

1. Import repository once
2. In Project Settings → Git:
   - **Production Branch**: `production`
   - Enable preview deployments for `staging` branch
3. In Settings → Domains:
   - Production domain → `production` branch
   - Staging domain → `staging` branch

#### C. Environment Variables

For each environment, configure appropriate environment variables:

**Common Variables:**
```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_APP_ENV=staging|production
```

**Staging Environment:**
- Go to Project Settings → Environment Variables
- Add variables with environment = "Production" (when staging is production branch)
- Example: `NEXT_PUBLIC_API_URL=https://staging-api.yourapp.com`

**Production Environment:**
- Go to Project Settings → Environment Variables
- Add variables with environment = "Production"
- Example: `NEXT_PUBLIC_API_URL=https://api.yourapp.com`

#### D. Custom Domains (Optional)

**Staging:**
1. Go to Project Settings → Domains
2. Add domain: `staging.yourapp.com`
3. Configure DNS records as instructed by Vercel

**Production:**
1. Go to Project Settings → Domains
2. Add domain: `yourapp.com` and `www.yourapp.com`
3. Configure DNS records as instructed by Vercel

### 3. Deployment Workflow

#### Deploy to Staging

```bash
# Switch to develop branch
git checkout develop

# Make your changes and commit
git add .
git commit -m "Your changes"

# Push to develop
git push origin develop

# Merge to staging when ready
git checkout staging
git merge develop
git push origin staging
```

This will automatically trigger a deployment to your staging environment on Vercel.

#### Deploy to Production

```bash
# After testing on staging, merge to production
git checkout production
git merge staging
git push origin production
```

This will automatically trigger a deployment to your production environment on Vercel.

### 4. Deployment Status

You can monitor deployment status:
- Vercel Dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- GitHub Actions (if configured)
- Vercel CLI: `vercel ls`

### 5. Rollback Strategy

If you need to rollback a deployment:

**Via Vercel Dashboard:**
1. Go to your project
2. Click on "Deployments"
3. Find the previous successful deployment
4. Click "..." → "Promote to Production"

**Via Git:**
```bash
# Revert to previous commit
git checkout production
git revert HEAD
git push origin production
```

## Branch Protection Rules

Consider adding branch protection rules on GitHub:

**For `production` branch:**
1. Go to GitHub → Settings → Branches
2. Add rule for `production` branch:
   - Require pull request reviews before merging
   - Require status checks to pass
   - Require branches to be up to date
   - Include administrators

**For `staging` branch:**
1. Add rule for `staging` branch:
   - Require pull request reviews (optional)
   - Require status checks to pass

## Quick Commands Reference

```bash
# Check current branch
git branch

# Push staging branch
git push origin staging

# Push production branch
git push origin production

# Merge develop → staging
git checkout staging
git merge develop
git push origin staging

# Merge staging → production
git checkout production
git merge staging
git push origin production

# Switch back to develop
git checkout develop
```

## Vercel CLI (Optional)

Install Vercel CLI for advanced deployment control:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Monitoring and Logs

- **Vercel Dashboard**: Real-time deployment logs
- **Runtime Logs**: Available in Vercel dashboard under "Functions" tab
- **Analytics**: Enable Vercel Analytics in project settings

## Troubleshooting

**Build fails on Vercel:**
1. Check build logs in Vercel dashboard
2. Verify environment variables are set correctly
3. Test build locally: `npm run build`

**Environment variables not working:**
1. Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
2. Redeploy after adding new variables
3. Check variable scope (Production/Preview/Development)

**Branch not auto-deploying:**
1. Check Git integration in project settings
2. Verify production branch is set correctly
3. Check if deployment is paused in settings

## Support

- Vercel Documentation: [https://vercel.com/docs](https://vercel.com/docs)
- Next.js Deployment: [https://nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
