---
name: supabase
description: Best practices, instructions, and schemas for managing Supabase database, auth, and real-time functions in EcoVerzz.
---

# Supabase Development Guide

## Project Configuration
- **Project Ref**: `zotygsvdthwhnzoucske`
- **URL**: `https://zotygsvdthwhnzoucske.supabase.co`
- **Publishable Key**: `sb_publishable_fhI-tS3x4zMYwoiztc84tw_ATQM6z4u`
- **MCP Endpoint**: `https://mcp.supabase.com/mcp?project_ref=zotygsvdthwhnzoucske&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching`

## Client SDK Usage
Use `supabase` imported from `src/services/supabaseClient`:

```typescript
import { supabase } from "../services/supabaseClient";

// Query table
const { data, error } = await supabase.from("your_table").select("*");

// Subscribe to real-time changes
const channel = supabase
  .channel("table-db-changes")
  .on("postgres_changes", { event: "*", schema: "public", table: "waste_reports" }, (payload) => {
    console.log("Realtime payload:", payload);
  })
  .subscribe();
```
