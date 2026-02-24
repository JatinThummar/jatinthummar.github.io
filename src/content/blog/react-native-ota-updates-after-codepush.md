---
title: 'React Native OTA Updates After CodePush: The Complete 2026 Guide'
description: 'CodePush is gone. Here is what actually works now: self-hosted, affordable, and scalable alternatives for every team size.'
publishDate: 2026-02-24
tags: ['react-native', 'expo', 'mobile', 'engineering']
order: 1
---

If you're a React Native developer who relied on Microsoft CodePush for over-the-air updates, you already know the pain. App Center shut down on March 31, 2025, and the [react-native-code-push](https://github.com/microsoft/react-native-code-push) repo was archived on May 20, 2025. It's read-only now. Gone.

But here's the thing nobody tells you: the ecosystem that filled the vacuum is surprisingly vibrant. Whether you want fully self-hosted, dirt-cheap managed services, or even a custom Expo OTA server, you have real options in 2026.

I spent weeks researching every alternative. This is the honest breakdown.

---

## Why CodePush Had to Die

It wasn't just about Microsoft shutting down App Center. CodePush had a fundamental technical problem: **it never supported React Native's New Architecture** (Fabric and TurboModules, introduced in RN 0.76+). Apps using CodePush had to explicitly opt out of the new architecture.

Microsoft did open-source a [standalone CodePush server](https://github.com/microsoft/code-push-server) before the shutdown, but archived it the same day. It had only 28 commits and required Azure infrastructure. The original repo had ~9,100 stars and 1,600 forks, so this affected a massive number of teams.

Some community forks tried to keep it alive. One detailed case study on [ITNEXT](https://itnext.io/from-deprecated-to-production-grade-self-hosting-codepush-for-react-native-725246bcdb1b) described 2+ months of debugging and estimated infrastructure costs of $600–800/month for 200K users, before counting DevOps labor.

The message is clear: self-hosting the old CodePush server is not worth the pain.

---

## Hot Updater: The Best Self-Hosted Option Right Now

**[Hot Updater](https://github.com/gronxb/hot-updater)** is the most actively developed open-source, self-hosted OTA solution in the React Native ecosystem today.

The numbers speak for themselves:

- **~1,300+ GitHub stars** (growing fast)
- **713+ commits**, multiple releases per month
- **Latest release: v0.25.8** (January 14, 2026)
- **~10,000 weekly npm downloads** for [`@hot-updater/react-native`](https://www.npmjs.com/package/@hot-updater/react-native)
- MIT licensed, fully self-hosted

Hot Updater's killer feature is its **plugin architecture**. You're not locked into any cloud provider. Mix and match:

- **Build plugins**: Metro, Re.Pack, Expo
- **Storage plugins**: AWS S3, Cloudflare R2, Supabase Storage, Firebase Storage
- **Database plugins**: PostgreSQL, Supabase, Cloudflare D1, MySQL, Firebase

It supports React Native's New Architecture, includes a web console for managing updates, handles forced updates and rollbacks, and added brownfield support (mixed native/RN apps) in v0.25.7.

The author, Sungyu Kang ([gronxb](https://github.com/gronxb)), has maintained an impressive release cadence. v0.25.0 through v0.25.8 shipped between mid-December 2025 and mid-January 2026 alone.

There are real adoption signals too. This [DEV.to guide](https://dev.to/ajmal_hasan/complete-guide-ota-setting-up-hot-updater-with-aws-s3-and-lambdaedge-for-react-native-11mb) walks through setting it up with AWS S3 and Lambda@Edge. The project's own docs are at [hot-updater.dev](https://hot-updater.dev/docs/get-started/basic-usage/).

It's still pre-1.0 (v0.25.x), so expect some breaking changes. But for teams with 100K+ users wanting full control and zero vendor lock-in, **this is the top recommendation right now**.

---

## Yes, Expo Supports Custom OTA Servers — No EAS Required

This is the part most people don't realize: Expo **officially supports** running custom update servers as an alternative to EAS Update. It's not a hack. It's a first-class capability built on the **[Expo Updates Protocol (v1)](https://docs.expo.dev/technical-specs/expo-updates-1/)**.

The configuration is simple: set `updates.url` in your `app.json` or `app.config.js` to point at your own server instead of Expo's. The `expo-updates` client library works with any server that implements the protocol.

Expo's [official documentation on custom update servers](https://docs.expo.dev/distribution/custom-updates-server/) describes this as an "escape hatch" for teams that need self-hosted infrastructure.

### Production-Ready Open-Source Servers

Three implementations are ready for production use today:

**[Expo Open OTA](https://github.com/axelmarciano/expo-open-ota)**: Written in Go. Designed for production with AWS S3 storage and CloudFront CDN. Supports AWS Secrets Manager for key management.

**[Xavia OTA](https://github.com/xavia-io/xavia-ota)**: Built with Next.js and TypeScript. ~369 GitHub stars. Docker deployment, admin dashboard, PostgreSQL backend. Describes itself as "a free, self-hosted alternative to EAS Updates."

**[Self-Hosted Expo Updates Server](https://github.com/umbertoghio/self-hosted-expo-updates-server)**: "Batteries included" approach with web UI, Docker Compose for production, and a companion client library.

Expo also provides a [reference implementation](https://github.com/expo/custom-expo-updates-server), but warns it's not production-ready.

If you're already on Expo and cost-sensitive, this is your move. Your app code barely changes: just point `updates.url` to your server.

---

## Affordable Commercial Alternatives

Not everyone wants to manage infrastructure. Here are the managed services that won't destroy your budget at scale.

### Revopush

**Website:** [revopush.org](https://revopush.org/)

The most seamless migration from CodePush. It's **100% API-compatible** with the original CodePush SDK, so migration is essentially a config change. Their SDK adds [New Architecture and Expo SDK 52+ support](https://revopush.org/react-native-code-push-client-new-architecture).

Pricing:

- $30/month: 200K updates
- $90/month: 1M updates
- No bandwidth limits

For comparison, the same workload on EAS Update costs ~$1,000–1,200/month. Revopush also offers delta updates that are 10–20x smaller than full bundles.

### AppZung

**Website:** [appzung.com](https://appzung.com/)

EU-based service with one-command migration from App Center:

```bash
npx @appzung/cli codepush migrate
```

Pricing starts at €1.50 per 1,500 MAU with 500K MAU included. They claim up to 5x cheaper than EAS Update and are already serving 2M+ end-users. Their [React Native SDK](https://github.com/AppZung/react-native-code-push) is on GitHub.

### React Native Stallion

**Website:** [stalliontech.io](https://stalliontech.io/)

Differentiates on **patch/delta updates**, reportedly 90–98% smaller than full bundles (e.g., 236KB vs 20MB). Offers both cloud hosting and a full [self-hosted option](https://stalliontech.io/self-hosted) for compliance requirements.

Supports Expo SDK 52+ and the New Architecture. Still newer (~118 GitHub stars), so verify their claims independently. But the technical approach is sound.

### Appcircle

**Website:** [appcircle.io/codepush](https://appcircle.io/codepush)

Targets enterprises with a full CI/CD platform that includes CodePush functionality. Cloud and self-hosted deployment, RBAC, SSO/LDAP, and code obfuscation. Enterprise pricing (contact sales). Does **not** support managed Expo apps.

---

## What Do Large Companies Actually Do?

Here's an uncomfortable truth: most companies with 100K+ React Native users don't publicly document their OTA strategy. Meta, Shopify, Amazon, and Walmart all use RN at massive scale, but their OTA tooling is internal.

What we do know:

- **Shopify** does weekly native releases and recently migrated fully to the New Architecture. They appear to rely on App Store releases rather than OTA for feature delivery.
- **Callstack** (the largest RN consultancy) positions OTA as an **emergency escape hatch**, not a primary delivery mechanism. Their post [Ship OTA When in an Emergency](https://www.callstack.com/blog/ship-over-the-air-when-in-an-emergency) makes this explicit.
- The most sophisticated approach at scale is **Module Federation via [Re.Pack](https://re-pack.dev/docs/getting-started/microfrontends)**. Instead of updating the entire JS bundle, independent teams deploy mini-app bundles to a CDN. [Re.Pack 5](https://www.callstack.com/blog/announcing-re-pack-5-with-rspack-module-federation) brought 5x faster builds with Rspack. [Zephyr Cloud](https://docs.zephyr-cloud.io/recipes/repack-mf) provides the deployment layer.
- One documented migration: **[Perficient](https://blogs.perficient.com/2025/06/02/over-the-air-ota-deployment-process-for-mobile-app/)** moved a client's production app from CodePush to EAS Updates in mid-2025.

---

## Cost Comparison at Scale

At **200K active users, 5 monthly releases**:

| Solution | Monthly Cost | Self-Hosted? | New Architecture? |
| --- | --- | --- | --- |
| Expo EAS Update | ~$1,000–1,200 | No | Yes |
| Self-Hosted CodePush | ~$600–800 + DevOps | Yes | No |
| Revopush | $30–90 | No | Yes |
| AppZung | ~€50–150 | No | Yes |
| Hot Updater | $50–200 (infra only) | Yes | Yes |
| Stallion (self-hosted) | Infra costs only | Yes | Yes |
| Xavia OTA / Expo Open OTA | Infra costs only | Yes | Yes (Expo) |

---

## Which One Should You Pick?

**Already using Expo and cost-sensitive?** Self-host with [Xavia OTA](https://github.com/xavia-io/xavia-ota) or [Expo Open OTA](https://github.com/axelmarciano/expo-open-ota). Your app code barely changes.

**Bare React Native or want maximum flexibility?** [Hot Updater](https://github.com/gronxb/hot-updater) is the clear leader for self-hosted. For managed service, [Revopush](https://revopush.org/) or [AppZung](https://appzung.com/) are dramatically cheaper than EAS.

**Large org with compliance needs?** [Stallion self-hosted](https://stalliontech.io/self-hosted) or [Appcircle](https://appcircle.io/codepush) for governance features like code signing, RBAC, and audit trails.

**Migrating from CodePush and want the least friction?** [Revopush](https://revopush.org/). It's API-compatible. Change your config and you're done.

---

## The Bottom Line

The post-CodePush landscape is more fragmented but ultimately healthier than the monoculture before it. Hot Updater has emerged as the strongest open-source contender. The Expo Updates Protocol is becoming a de facto standard with multiple independent server implementations.

The biggest shift: **delta/patch updates are becoming table stakes**. EAS Update still ships full bundles, while Stallion and Revopush send only changed bytes. At scale, that's not just a cost issue — it's a UX issue.

If you're evaluating solutions in 2026, treat **patch update support** and **New Architecture compatibility** as non-negotiable, and build your decision from there.

---

## References

- [Hot Updater Docs](https://hot-updater.dev/docs/get-started/basic-usage/)
- [Hot Updater GitHub](https://github.com/gronxb/hot-updater)
- [Expo Custom Updates Server Guide](https://docs.expo.dev/distribution/custom-updates-server/)
- [Expo Updates Protocol Spec](https://docs.expo.dev/technical-specs/expo-updates-1/)
- [Expo Open OTA](https://github.com/axelmarciano/expo-open-ota)
- [Xavia OTA](https://github.com/xavia-io/xavia-ota)
- [Revopush CodePush Alternatives](https://revopush.org/react-native-codepush-alternative)
- [AppZung FAQ](https://appzung.com/faq/)
- [Stallion OTA Updates Guide](https://www.stalliontech.io/react-native-ota-updates-guide)
- [Appcircle CodePush Alternatives](https://appcircle.io/codepush-alternatives)
- [Callstack: Ship OTA When in an Emergency](https://www.callstack.com/blog/ship-over-the-air-when-in-an-emergency)
- [Re.Pack 5 with Rspack and Module Federation](https://www.callstack.com/blog/announcing-re-pack-5-with-rspack-module-federation)
- [OTA Updates with Zephyr Cloud (Nx Blog)](https://nx.dev/blog/ota-updates-with-zephyr)
- [Self-Hosting CodePush Case Study (ITNEXT)](https://itnext.io/from-deprecated-to-production-grade-self-hosting-codepush-for-react-native-725246bcdb1b)
- [Perficient: OTA Deployment After CodePush](https://blogs.perficient.com/2025/06/02/over-the-air-ota-deployment-process-for-mobile-app/)
- [AppCenter Retirement: What Now? (NextPush)](https://nextpush.center/blog/appcenter-retirement-what-should-we-do-now)
- [OTA Updates Without CodePush (Subramanya's Blog)](https://subramanyarao.hashnode.dev/react-native-ota-updates-strategies-after-microsoft-codepush-ends)
