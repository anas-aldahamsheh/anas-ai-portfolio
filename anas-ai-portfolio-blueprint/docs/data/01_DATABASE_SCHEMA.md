# Database Schema — Logical Model

Use normalized PostgreSQL tables with UUID primary keys unless a stronger reason exists.

## Identity
- `user`
- `session`
- auth-library required tables
- `user_role`

## Localization
- `locale`
- `ui_text_key`
- `ui_text_translation`

## Content/CMS
- `page`
- `page_translation`
- `section`
- `section_translation`
- `section_block`
- `section_block_translation`
- `publish_revision`

## Projects
- `project`
- `project_translation`
- `project_category`
- `project_category_link`
- `project_tag`
- `project_tag_link`
- `project_block`
- `project_block_translation`
- `project_link`
- `project_media`

## CV
- `cv_version`
- `cv_publication`

## Social
- `social_profile`
- `social_profile_translation`

## AI
- `ai_provider`
- `ai_model`
- `ai_model_assignment`
- `ai_runtime_policy`
- `prompt`
- `prompt_version`
- `rag_configuration`
- `rag_index_version`
- `ingestion_job`
- `source_document`
- `source_chunk`

## Evaluation
- `evaluation_dataset`
- `evaluation_case`
- `evaluation_run`
- `evaluation_result`
- `evaluation_metric`

## Admin/system
- `feature_flag`
- `theme_configuration`
- `audit_event`
- `system_setting`
- `secret_reference`

## Constraints
- foreign keys;
- unique slugs per scope;
- unique semantic translation keys;
- unique active assignment per AI role/environment;
- only one published current CV;
- indexes for publish state/order/slug/project IDs;
- timestamps stored as timestamptz/UTC;
- optimistic concurrency/version where admin collisions matter.

Exact Drizzle schema must be documented beside migrations.
