---
slug: "2026-11-22-find-the-agent-subnet-then-check-cosmos-dns"
title: "Find the agent subnet, then check Cosmos DNS"
excerpt: "The Agents page timed out after you locked Foundry to your own virtual network. Ask the account which subnet it injected, then check that Cosmos DNS answers inside that network. The 8-second listing error is on this morning's post. The portal string and the Entra exclusion live on two different Learn pages."
date: "2026-11-22"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-22-find-the-agent-subnet-then-check-cosmos-dns"
categories: ["Microsoft", "AI Agents"]
tags: ["Microsoft Foundry", "hosted agents", "virtual network", "Cosmos DB", "how-to"]
readTime: 12
image: "/images/blog/2026-11-22-find-the-agent-subnet-then-check-cosmos-dns-hero.png"
---

If the Agents page times out after you lock a Foundry account to your own virtual network, ask the account which subnet it injected, then check that Cosmos DNS answers inside that network.

That subnet is where the hosted agent sessions run. Each project also keeps a private outbound door there. The real name is a data proxy. Tool calls leave through it. By the end you can name the subnet from the account, read the timeout this morning's post prints, and keep the sign-in exclusion on the page that owns it.

## Open the post that lists the five checks

The post is [Hosted agents in your own virtual network: five checks when the Agents page times out](https://devblogs.microsoft.com/foundry/hosted-agents-private-network-setup/), by Muzz Imam. I fetched that URL this morning. The first response was a 301 to the trailing-slash path. The followed response was HTTP 200. The Date header was `Sun, 22 Nov 2026 12:01:24 GMT`. The saved HTML is 237,187 bytes.

The meta `article:published_time` is `2026-11-21T18:12:21+00:00`. JSON-LD `datePublished` is that same instant, twice. A search of the saved HTML found zero `article:modified_time` and zero `dateModified`. The author meta is `Muzz Imam`. The visible date sits in a span: November 21st, 2026.

The Foundry feed item for this title is `Sat, 21 Nov 2026 18:12:21 +0000`, the same instant as `datePublished`. I saved that feed this morning. It is 213,965 bytes and ten items. This post is the newest item.

Python, against the fetch clock `2026-11-22T12:01:24Z` (7:01 AM Eastern), put the publish instant 17.82 hours earlier. Against 07:00 ET (`2026-11-22T12:00:00Z`) that age is 17.79 hours. Both sit inside 48 hours.

The same morning I fetched four Learn pages as markdown. Each one came back HTTP 200.

[Set up private networking for Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/virtual-networks) returned Date `Sun, 22 Nov 2026 12:01:11 GMT`, 42,487 bytes, `last-modified` `Sat, 21 Nov 2026 15:15:10 GMT`. `ms.date` is `2026-11-17T00:00:00.0000000Z`. `updated_at` is `2026-11-18T15:57:00.0000000Z`. Against 07:00 ET, `ms.date` is 132.00 hours, `updated_at` is 92.05 hours, and `last-modified` is 20.75 hours.

[Connect agents to services that use a private certificate authority](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/private-certificate-authority) returned Date `Sun, 22 Nov 2026 12:01:11 GMT`, 32,297 bytes, `last-modified` `Sat, 21 Nov 2026 10:18:43 GMT`. `ms.date` is `2026-11-18T00:00:00.0000000Z`. `updated_at` is `2026-11-21T10:08:00.0000000Z`. Against 07:00 ET, `last-modified` is 25.69 hours and `updated_at` is 25.87 hours.

[Deep dive into Foundry Agent Service networking](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agents-networking-deep-dive) returned Date `Sun, 22 Nov 2026 12:01:12 GMT`, 19,193 bytes, `last-modified` `Sun, 22 Nov 2026 11:24:48 GMT`. `ms.date` is `2026-11-09T00:00:00.0000000Z`. `updated_at` is `2026-11-19T23:13:00.0000000Z`. Against 07:00 ET, `last-modified` is 0.59 hours and `updated_at` is 60.78 hours. The sentences below are the ones on this morning's copy.

[Troubleshoot hosted agent virtual network connectivity](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/troubleshoot-hosted-agent-networking) returned Date `Sun, 22 Nov 2026 12:01:11 GMT`, 20,648 bytes, `last-modified` `Tue, 10 Nov 2026 18:39:03 GMT`. `ms.date` is `2026-11-09T00:00:00.0000000Z`. `updated_at` is `2026-11-10T15:04:00.0000000Z`. Against 07:00 ET, `ms.date` is 324.00 hours, `updated_at` is 284.93 hours, and `last-modified` is 281.35 hours. Use that page for the jump-box warning.

The new primary is the blog. The Learn pages are the companions it links.

## Ask the account which subnet it used

Everyday words first: the Agents page is waiting on a database the agent subnet cannot see. The real name for attaching that subnet when you create the account is network injection.

The blog's first check asks the account which subnet became the agent subnet:

```bash
az cognitiveservices account show \
  --name my-foundry --resource-group <rg> \
  --query "properties.networkInjections"
```

The sample object has `"scenario": "agent"` and `"useMicrosoftManagedNetwork": false`. The sample subnet id ends in `agent-subnet`. `my-foundry` and `agent-subnet` are the sample's names. A search of the saved HTML found one `my-foundry` and nine `agent-subnet`. Use the subnet id the query returns on your account.

Then look at that subnet. The blog's second command is `az network vnet subnet show`, with a query for the prefix, the delegations, the service association links, and the route table. The sample result shows delegation `Microsoft.App/environments`, link `legionservicelink`, prefix `10.0.4.0/24`, and `"routeTable": null`.

What the blog calls good:

- The subnet is delegated to `Microsoft.App/environments`.
- It is `/27` or larger. Production starts at `/24` or larger.
- The range is RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, or `192.168.0.0/16`. Every region where Agent Service is available supports `10.0.0.0/8`.
- The range does not overlap a peered virtual network.
- It belongs to one Foundry resource. Several Foundry resources can share a virtual network, and each one needs its own agent subnet.
- `legionservicelink` means the agent environment is using the subnet. The blog says you will meet that name again in the delete check.

The blog also says network injection has to be part of the Foundry account when you first create it, and you cannot add it to an existing account later. The setup guide prints the same limit in its own words: "Adding network injection to an existing Foundry account after creation isn't supported for Hosted agents." Quote each sentence from its own page.

A search of the four Learn files for `networkInjections` returned zero hits. Teach the query from the blog.

## Read the timeout, then check Cosmos DNS

The timeout the blog says it sees most is: "Listing agents timed out after 8s while reading the agent index." The blog says that comes back as `400 invalid_configuration`, and the portal can show `Timeout of 60000ms exceeded` on the Agent pages. A search of the saved HTML found two `Listing agents timed out`, one `invalid_configuration`, and one `60000ms`.

A search of the four Learn files for `Listing agents timed out`, for `invalid_configuration`, and for `8s` returned zero hits. The setup guide's matching row is the portal string, and its solution is to verify Cosmos private-endpoint and DNS connectivity. The private CA page has a troubleshoot row for `Timeout of 60000ms exceeded` behind a firewall that does TLS inspection, even after you add the firewall's CA. That row's fix is the sign-in host exclusion. Keep the 8-second listing error, the portal string, and the private CA row as three separate sentences.

The blog says the data proxy in the agent subnet could not reach your Cosmos DB account in time. It names DNS and the sign-in check as the two causes it sees most. Start with DNS.

Confirm the Cosmos private endpoint exists and is approved. Look for the `Sql` group:

```bash
az network private-endpoint list --resource-group <rg> \
  --query "[].{name:name, group:privateLinkServiceConnections[0].groupIds[0], status:privateLinkServiceConnections[0].privateLinkServiceConnectionState.status}" \
  -o table
```

Next, check that the `privatelink.documents.azure.com` zone is linked to the virtual network that contains the agent subnet. A private DNS zone only answers for virtual networks that are linked to it:

```bash
az network private-dns link vnet list --resource-group <dns-rg> \
  --zone-name privatelink.documents.azure.com \
  --query "[].{name:name, vnet:virtualNetwork.id, state:virtualNetworkLinkState}" -o table
```

Then check the records. You should see one for the account and one for each region it runs in:

```bash
az network private-dns record-set a list --resource-group <dns-rg> \
  --zone-name privatelink.documents.azure.com \
  --query "[].{name:name, ip:aRecords[0].ipv4Address}" -o table
```

The sample table shows `my-cosmos` at `10.0.5.9` and `my-cosmos-westus3` at `10.0.5.10`. Those names are the sample's names.

If the virtual network uses custom DNS servers instead of Azure DNS, the blog says those servers must forward these zones to `168.63.129.16` from a linked virtual network. DNS servers on premises cannot reach that address, so point them at a DNS forwarder or Azure DNS Private Resolver in Azure instead. Last, from a VM in the same virtual network, run `nslookup <account>.documents.azure.com` and confirm it returns your Cosmos DB private endpoint's IP.

The setup guide's DNS section also names `168.63.129.16` and both Cosmos names, `<account>.documents.azure.com` and `<account>-<region>.documents.azure.com`. Its DNS table names the Cosmos group `Sql` and the zone `privatelink.documents.azure.com`. A search of that file found one `Sql`, on that table row, and zero `az network private-endpoint list`. Paste the blog query as the blog query. Use the guide when you want the group name and both `nslookup` names in one place.

## Leave sign-in traffic out of TLS inspection

Everyday words first: a firewall that opens TLS and re-signs it can still break the platform's own login, even after you add that firewall's certificate. The real name for the certificate feature is private CA trust.

The blog quotes a docs sentence: private CA trust doesn't apply to the platform's own Microsoft Entra ID and managed identity traffic from the agent subnet. That sentence is on the private CA page, in Known limitations, and the page continues: if a firewall TLS-inspects that traffic, agent operations such as listing agents or conversations can fail or time out, even after you add the firewall's CA. The private CA page's `updated_at` is `2026-11-21T10:08:00.0000000Z`, 25.87 hours before 07:00 ET.

The blog's fix has two parts. Exclude `login.microsoftonline.com`, `{region}.login.microsoft.com`, and `control-{region}.identity.azure.net` from TLS inspection. Allow those hosts on the firewall, plus the managed identity FQDNs from the Azure Container Apps firewall guidance or the `AzureActiveDirectory` service tag. If you put an NSG on the agent subnet, the blog says add a matching outbound rule for that service tag. A search of the saved HTML found two `AzureActiveDirectory`.

The setup guide's allow-list bullet names the same three hosts. On this morning's copy it also says to add the `AzureActiveDirectory` service tag, or the Managed Identity FQDNs from the Container Apps firewall article, and to add a matching outbound allow rule if an NSG sits on the delegated subnet. A search of that file found two `AzureActiveDirectory`, both on that bullet. A search of the private CA page found zero. The private CA page names the same three hosts to exclude from TLS inspection.

Keep private CA trust for the job that page describes: tools, model gateways, and your own agent code calling internal services that use your company's certificates, with certificate checks still on.

## Peering can work. DNS still follows the agent subnet

The blog says peered virtual networks are supported, and data transfer costs can increase. The setup guide's FAQ says you can use peered virtual networks, and that data transfer costs can increase. It adds the DNS step the blog also prints: if the private endpoints sit in a peered virtual network, link their private DNS zones to the virtual network that contains the agent subnet. A zone linked only to the hub stays quiet in the spoke.

The blog says you do not need a route table for peering, because Azure adds a system route, and you add a route table only if the design sends traffic through a firewall. The setup guide says Foundry Agent Service requires the subnet delegation, and that a route table is a separate choice. If you attach one, its routes must leave the peering routes to your private endpoints in place. Keep those as two sentences.

## Purge a deleted account before you reuse the subnet

Everyday words first: a deleted account can still hold the subnet. The real name is soft-delete. The agent environment keeps the subnet until someone purges the account.

The blog's fifth check is `DelegatedSubnetInUse` after you delete an account. List soft-deleted accounts, then purge the one you are done with. Purge is permanent, so check the name first. It needs Cognitive Services Contributor, or Contributor assigned at the subscription level:

```bash
az cognitiveservices account list-deleted -o table
az cognitiveservices account purge \
  --location <region> --resource-group <rg> --name <old-account>
```

Give the platform some time, then check that the link is gone:

```bash
az network vnet subnet show \
  --resource-group <rg> --vnet-name <vnet> --name agent-subnet \
  --query "serviceAssociationLinks[].name"
```

An empty list means the subnet is free. `agent-subnet` in that command is still the sample's name. Use the name from the first query.

The setup guide's `DelegatedSubnetInUse` row says purge from **Manage deleted resources**, or use a different subnet, and that release can take some time. The portal path and the `az` purge are two doors. Follow the page you have open. The guide also prints `legionservicelink` in a different delete error, the one about a subnet that still references that service association link. A search of that file found one `legionservicelink`, on that error. A search of the blog HTML found two. Keep the in-use error and the leftover-link error apart.

## Two watch-outs, then the jump box

The blog says keep private endpoint addresses out of `192.168.0.0/24` for hosted agents. That range overlaps an internal sandbox network, and connections can fail with "No route to host" even when DNS is right. The setup guide says the same range can fail with `EHOSTUNREACH` ("No route to host"), and its workaround is to move the private endpoint, update DNS, and verify HTTPS from the hosted agent. The deep dive points at that limitation instead of restating the error name.

The blog says the portal does not show IP use for the delegated subnet. Watch for `429 subnet_exhausted` on session create or resume, and 5xx errors from the data proxy. The deep dive says the portal doesn't currently expose IP utilization for delegated subnets, and names HTTP 5xx from the data proxy and HTTP 429 `subnet_exhausted` during session creation or resume.

The blog's last pointer is the troubleshoot article, for DNS, TCP, and TLS checks from a jump box. That article says a jump box checks access from its own subnet, not from the delegated agent subnet. It also says the diagnostic agent tests the hosted VM's direct outbound path and doesn't validate tool calls through the data proxy. Use that page for the warning. The checks above are the ones on this morning's blog.

The blog also says the Foundry resource and the virtual network must be in the same region, and that Cosmos DB, Storage, and Search can sit in other regions. The setup guide prints that same region split under limitations.

## Try it on the account you already have

Sign in with the Azure CLI to the subscription that holds the Foundry account. Run the `networkInjections` query from the blog. Read the subnet id it returns. Then run the subnet show against that name, and look for `Microsoft.App/environments` and `legionservicelink`.

If the Agents page is the thing that timed out, run `nslookup` for `<account>.documents.azure.com` from a VM in that virtual network. The blog wants the Cosmos private endpoint's IP back.

When you run that account query, does `networkInjections` name the subnet you thought was the agent subnet?
