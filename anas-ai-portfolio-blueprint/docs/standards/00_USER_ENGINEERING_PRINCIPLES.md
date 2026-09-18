### Architecture & Design

-  استخدم **Separation of Concerns** بوضوح. 
-  طبّق **Single Responsibility Principle** قدر الإمكان. 
-  اتبع مبادئ **SOLID** بدون overengineering. 
-  اعتمد **Modular Architecture** بحيث كل جزء مستقل قدر الإمكان. 
-  حافظ على **Low Coupling / High Cohesion**. 
-  استخدم **Dependency Injection** عندما يكون مناسبًا. 
-  اعتمد **Dependency Inversion** بدل ربط الـ business logic مباشرة بمكتبات أو providers. 
-  افصل **Business Logic** عن UI وDatabase وExternal APIs. 
-  استخدم abstraction فقط عندما تحل مشكلة حقيقية. 
-  تجنب **God Classes / God Components / God Functions**. 
-  تجنب الـ circular dependencies. 
-  صمم النظام بحيث يمكن استبدال Database أو API أو AI Model أو Provider بأقل تغييرات. 
-  اختر architecture مناسبة لحجم المشروع، وليس architecture معقدة لمجرد أنها مشهورة. 
-  ابدأ Modular Monolith عندما يكون مناسبًا بدل القفز مباشرة إلى Microservices. 
-  اجعل boundaries بين modules واضحة ومحددة. 
-  حافظ على contracts واضحة بين أجزاء النظام. 
-  صمم للتغيير المستقبلي بدون محاولة توقع كل شيء مسبقًا. 

### Clean Code

-  الكود يجب أن يكون **Readable قبل أن يكون Clever**. 
-  استخدم أسماء variables/functions/classes واضحة ومعبرة. 
-  اجعل functions قصيرة ومركزة على مهمة واحدة. 
-  تجنب nested logic العميق. 
-  استخدم early returns عندما تحسن القراءة. 
-  تجنب duplicated logic. 
-  طبق **DRY – Don’t Repeat Yourself** باعتدال. 
-  لا تبالغ في DRY عندما يؤدي إلى abstractions معقدة. 
-  طبق **KISS – Keep It Simple**. 
-  طبق **YAGNI – You Aren’t Gonna Need It**. 
-  لا تكتب dead code. 
-  لا تترك commented-out code. 
-  لا تستخدم magic numbers أو magic strings. 
-  ضع constants/configuration في أماكن واضحة. 
-  استخدم consistent naming conventions. 
-  استخدم consistent project structure. 
-  اجعل formatting موحدًا. 
-  استخدم linter وformatter. 
-  قلل side effects. 
-  فضل pure functions عندما يكون ذلك منطقيًا. 
-  لا تعتمد على global mutable state. 
-  استخدم immutable data عندما يكون ذلك مناسبًا. 
-  التعليقات يجب أن تشرح **لماذا** وليس ماذا يفعل الكود الواضح أصلًا. 

### Reusability

-  ابنِ reusable components عندما يوجد reuse حقيقي. 
-  اجعل utilities عامة وغير مرتبطة بسياق محدد بدون داعٍ. 
-  افصل shared logic عن feature-specific logic. 
-  استخدم composable components. 
-  صمم APIs وfunctions بعقود واضحة. 
-  تجنب duplication بين modules. 
-  لا تحول كل شيء إلى generic abstraction. 
-  reusable code يجب أن يبقى سهل الفهم والصيانة. 

### Maintainability

-  أي مطور جديد يجب أن يستطيع فهم المشروع بسرعة. 
-  اجعل directory structure predictable. 
-  حافظ على boundaries بين features. 
-  قلل hidden behavior. 
-  قلل implicit dependencies. 
-  استخدم configuration واضحة. 
-  لا توزع business rules في عشرات الأماكن. 
-  حافظ على single source of truth. 
-  اجعل refactoring ممكنًا بدون كسر النظام بالكامل. 
-  حافظ على backwards compatibility عندما يكون مطلوبًا. 
-  سجل technical debt المهم بدل تجاهله. 

### Scalability

-  صمم النظام ليستطيع التوسع Horizontal Scaling عند الحاجة. 
-  تجنب الاعتماد على local memory للحالة المشتركة. 
-  اجعل services stateless قدر الإمكان. 
-  استخدم caching بشكل مدروس. 
-  ضع cache invalidation strategy واضحة. 
-  استخدم pagination للبيانات الكبيرة. 
-  لا تحمل datasets ضخمة مرة واحدة. 
-  استخدم streaming عندما يكون مناسبًا. 
-  استخدم asynchronous processing للعمليات الثقيلة. 
-  استخدم queues للمهام الطويلة أو غير المتزامنة. 
-  استخدم batching عند التعامل مع كميات كبيرة. 
-  ضع rate limits. 
-  تعامل مع concurrency بشكل صحيح. 
-  امنع race conditions. 
-  استخدم locking فقط عند الضرورة. 
-  راقب database connection pools. 
-  صمم النظام لتحمل زيادة المستخدمين والrequests. 
-  اعمل capacity planning للموارد الحرجة. 

### Performance

-  لا تعمل premature optimization. 
-  قِس الأداء قبل تحسينه. 
-  راقب latency وthroughput. 
-  تجنب N+1 queries. 
-  استخدم indexes الصحيحة. 
-  قلل unnecessary database calls. 
-  قلل unnecessary API calls. 
-  استخدم caching عند وجود فائدة واضحة. 
-  استخدم lazy loading عندما يكون مناسبًا. 
-  استخدم pagination. 
-  استخدم compression عند الحاجة. 
-  قلل payload sizes. 
-  استخدم CDN للـ static assets عند الحاجة. 
-  قلل frontend bundle size. 
-  استخدم code splitting. 
-  راقب memory leaks. 
-  راقب CPU usage. 
-  راقب database bottlenecks. 
-  ضع performance budgets للعمليات المهمة. 

### Database & Data

-  اختر database بناءً على طبيعة البيانات وليس الشهرة. 
-  صمم schema بشكل واضح. 
-  استخدم normalization عندما يكون مناسبًا. 
-  استخدم denormalization فقط لسبب واضح. 
-  ضع indexes حسب actual query patterns. 
-  استخدم transactions للعمليات التي تحتاج atomicity. 
-  حافظ على data integrity. 
-  استخدم foreign keys/constraints عندما يكون ذلك مناسبًا. 
-  استخدم migrations لجميع schema changes. 
-  migrations يجب أن تكون versioned وقابلة للتتبع. 
-  لا تعدل production database يدويًا بدون process. 
-  اعمل backups منتظمة. 
-  اختبر restoration من backups. 
-  استخدم retention policies. 
-  لا تخزن بيانات غير ضرورية. 
-  ضع strategy للـ archival/purging. 
-  تعامل مع timezone والتواريخ بطريقة موحدة. 
-  لا تعتمد على client لتحديد بيانات حساسة أو authoritative values. 

### API Design

-  APIs يجب أن تكون consistent. 
-  استخدم naming واضح. 
-  استخدم HTTP methods/status codes بشكل صحيح. 
-  اعمل versioning عندما يكون مطلوبًا. 
-  validation لكل input. 
-  استخدم schemas واضحة للrequests/responses. 
-  errors لها format موحد. 
-  لا تكشف internal errors للمستخدم. 
-  استخدم pagination/filtering/sorting بطريقة موحدة. 
-  اجعل APIs idempotent عندما يكون ذلك مناسبًا. 
-  استخدم timeouts. 
-  retries فقط للعمليات الآمنة. 
-  استخدم exponential backoff. 
-  تعامل مع rate limits. 
-  وثّق APIs. 
-  حافظ على backwards compatibility. 
-  لا ترسل بيانات أكثر مما يحتاجه العميل. 

### Security

-  طبق **Security by Design** وليس كمرحلة أخيرة. 
-  طبق **Least Privilege**. 
-  افصل Authentication عن Authorization. 
-  تحقق من authorization على الـ backend دائمًا. 
-  لا تثق بأي input من المستخدم. 
-  Validate + sanitize inputs. 
-  استخدم parameterized queries. 
-  امنع SQL Injection. 
-  امنع XSS. 
-  امنع CSRF عندما يكون relevant. 
-  امنع SSRF. 
-  امنع command injection. 
-  امنع path traversal. 
-  تعامل مع insecure deserialization. 
-  احمِ file uploads. 
-  تحقق من file type/size/content. 
-  لا تخزن passwords كنص صريح. 
-  استخدم modern password hashing. 
-  لا تكتب secrets داخل source code. 
-  استخدم secret management. 
-  لا تسجل passwords/tokens/API keys في logs. 
-  استخدم HTTPS/TLS. 
-  استخدم secure cookies. 
-  استخدم proper session management. 
-  طبق token expiration/rotation. 
-  استخدم MFA للأجزاء الحساسة عندما يلزم. 
-  ضع rate limiting ضد abuse/brute force. 
-  ضع account lockout/protection بشكل مدروس. 
-  طبق security headers. 
-  ضع CORS policy محددة. 
-  اعمل dependency vulnerability scanning. 
-  حدّث dependencies باستمرار. 
-  طبق OWASP best practices. 
-  اعمل security testing قبل production. 
-  ضع audit logs للعمليات الحساسة. 

### Privacy

-  اجمع أقل كمية بيانات ممكنة. 
-  طبق Data Minimization. 
-  حدد سبب جمع كل معلومة. 
-  حدد retention period. 
-  اعمل masking للبيانات الحساسة. 
-  استخدم encryption at rest للبيانات الحساسة. 
-  استخدم encryption in transit. 
-  لا ترسل PII لخدمات خارجية دون ضرورة. 
-  اجعل حذف بيانات المستخدم ممكنًا عند الحاجة. 
-  افصل بيانات المستخدمين بشكل صحيح. 
-  لا تسمح cross-tenant data leakage. 

### Authentication & Authorization

-  استخدم proven authentication libraries بدل بناء auth من الصفر. 
-  طبق RBAC أو ABAC حسب الحاجة. 
-  تحقق من permissions في كل sensitive action. 
-  لا تعتمد على إخفاء الزر في frontend كauthorization. 
-  sessions يجب أن تنتهي بشكل آمن. 
-  passwords reset flows يجب أن تكون آمنة. 
-  email verification عندما يكون مطلوبًا. 
-  refresh tokens يجب تخزينها والتعامل معها بأمان. 
-  permissions يجب أن تكون deny-by-default. 

### Error Handling

-  تعامل مع expected errors بشكل واضح. 
-  لا تستخدم generic catch لكل شيء بدون معالجة. 
-  صنف الأخطاء. 
-  user-facing errors تكون مفهومة. 
-  internal errors تحتوي معلومات debugging مناسبة. 
-  لا تكشف stack traces للمستخدم. 
-  استخدم centralized error handling. 
-  اعمل retries فقط للأخطاء transient. 
-  استخدم fallback عندما يكون مناسبًا. 
-  failures يجب ألا تسبب data corruption. 

### Reliability

-  صمم النظام ليفشل بشكل آمن. 
-  استخدم graceful degradation. 
-  ضع fallbacks للdependencies الحرجة. 
-  استخدم timeouts لكل external service. 
-  استخدم retries + exponential backoff + jitter. 
-  استخدم Circuit Breaker عندما يكون مناسبًا. 
-  استخدم health checks. 
-  استخدم readiness checks. 
-  استخدم liveness checks. 
-  تعامل مع partial failures. 
-  العمليات الحرجة يجب أن تكون idempotent. 
-  استخدم dead-letter queues عند الحاجة. 
-  لا تفترض أن network calls ستنجح دائمًا. 
-  لا تفترض أن external APIs متاحة دائمًا. 

### Observability

-  استخدم structured logging. 
-  logs تحتوي timestamp + severity + context. 
-  استخدم correlation/request IDs. 
-  استخدم distributed tracing عند وجود عدة services. 
-  راقب metrics الأساسية. 
-  راقب latency. 
-  راقب error rate. 
-  راقب throughput. 
-  راقب resource utilization. 
-  راقب external dependencies. 
-  أنشئ dashboards. 
-  ضع alerts ذات معنى. 
-  تجنب alert fatigue. 
-  اجعل debugging في production ممكنًا بدون كشف بيانات حساسة. 

### Testing

-  اكتب Unit Tests للـ business logic. 
-  Integration Tests للتكامل بين الأنظمة. 
-  API Tests. 
-  Database Tests عند الحاجة. 
-  End-to-End Tests للمسارات الحرجة. 
-  Regression Tests للأخطاء السابقة. 
-  Security Tests. 
-  Performance Tests. 
-  Load Tests. 
-  Stress Tests عند الحاجة. 
-  Test edge cases. 
-  Test failure scenarios. 
-  Test retries/timeouts. 
-  Test authorization. 
-  Test invalid inputs. 
-  لا تعتمد فقط على happy path. 
-  tests يجب أن تكون deterministic. 
-  tests لا تعتمد على ترتيب التنفيذ. 
-  tests لا تعتمد على production services. 
-  لا تختبر implementation details بلا داعٍ. 
-  حافظ على test coverage جيد، لكن لا تجعل النسبة هدفًا بحد ذاتها. 

### Production Readiness

-  المشروع لا يعتبر جاهز Production فقط لأنه يعمل محليًا. 
-  استخدم Environment Variables. 
-  افصل dev/staging/production. 
-  لا تستخدم production credentials في development. 
-  استخدم production-safe configuration. 
-  طبق feature flags للتغييرات الخطرة عندما يكون مناسبًا. 
-  اعمل smoke tests بعد deployment. 
-  تأكد من rollback strategy. 
-  اعمل migration strategy آمنة. 
-  تأكد من backups. 
-  تأكد من monitoring. 
-  تأكد من alerts. 
-  تأكد من logging. 
-  تأكد من health endpoints. 
-  تأكد من security configuration. 
-  تأكد من rate limits. 
-  تأكد من resource limits. 
-  تأكد من disaster recovery plan. 

### CI/CD

-  كل commit مهم يمر automated checks. 
-  run formatter/linter. 
-  run static analysis. 
-  run tests. 
-  run security scanning. 
-  run dependency scanning. 
-  build verification. 
-  deployment يكون repeatable. 
-  لا تعتمد على manual undocumented deployment. 
-  استخدم immutable artifacts عندما يكون ممكنًا. 
-  استخدم staging قبل production. 
-  استخدم automated rollback أو rollback واضح. 
-  استخدم Blue/Green أو Canary deployment عندما تستدعي الحاجة. 
-  لا تنشر code فشل في tests. 

### Configuration

-  طبق **Configuration over Hardcoding**. 
-  افصل config حسب environment. 
-  secrets منفصلة عن configuration العادية. 
-  validate configuration عند startup. 
-  التطبيق يجب أن يفشل مبكرًا إذا كان config الأساسي ناقصًا. 
-  استخدم sensible defaults فقط للأشياء الآمنة. 

### Frontend

-  استخدم component architecture واضحة. 
-  components صغيرة ومركزة. 
-  افصل presentation عن business logic قدر الإمكان. 
-  state management لا يكون أكثر تعقيدًا من اللازم. 
-  لا تستخدم global state لما يمكن أن يكون local. 
-  تعامل مع loading/error/empty states. 
-  تعامل مع slow network. 
-  تعامل مع failed requests. 
-  responsive design. 
-  keyboard accessibility. 
-  semantic HTML. 
-  accessibility standards. 
-  لا تجعل UI يعتمد بالكامل على JavaScript إن لم يكن ضروريًا. 
-  optimize rendering. 
-  تجنب unnecessary rerenders. 
-  optimize images/assets. 
-  اعمل client-side validation لتحسين UX، لكن server-side validation يبقى إلزاميًا. 

### UX

-  النظام يكون predictable. 
-  actions المهمة لها feedback. 
-  المستخدم يعرف أن العملية loading. 
-  المستخدم يعرف لماذا حدث error بطريقة مفهومة. 
-  confirmation للعمليات destructive. 
-  prevent accidental double submission. 
-  حافظ على consistency. 
-  لا تجعل المستخدم يفكر أين يجد وظيفة أساسية. 
-  وفر empty states مفيدة. 
-  حافظ على accessibility. 
-  اجعل النظام responsive وسريع. 

### Accessibility

-  Keyboard navigation. 
-  Focus management. 
-  Semantic HTML. 
-  ARIA عند الحاجة وليس بشكل عشوائي. 
-  Screen-reader support. 
-  Contrast مناسب. 
-  Form labels واضحة. 
-  Error messages مرتبطة بالحقول. 
-  لا تعتمد على اللون وحده لنقل المعلومات. 

### Concurrency & Distributed Systems

-  فكر في race conditions. 
-  فكر في duplicate requests. 
-  استخدم idempotency keys عند الحاجة. 
-  تعامل مع eventual consistency. 
-  تجنب distributed locks إلا إذا كانت ضرورية. 
-  transactions لا تمتد عبر external services قدر الإمكان. 
-  استخدم outbox/event patterns عندما تستدعي الحاجة. 
-  تعامل مع message duplication. 
-  تعامل مع out-of-order events. 
-  لا تفترض exactly-once delivery بسهولة. 

### External Integrations

-  ضع abstraction للthird-party providers. 
-  external calls لها timeout. 
-  retries مدروسة. 
-  circuit breakers عند الحاجة. 
-  validation لكل response خارجي. 
-  تعامل مع schema changes. 
-  تعامل مع provider outages. 
-  لا تجعل core business logic يعتمد مباشرة على provider محدد. 
-  وفر fallback أو graceful degradation عندما يكون منطقيًا. 

### Documentation

-  README واضح. 
-  شرح setup. 
-  شرح architecture. 
-  شرح environment variables. 
-  شرح database migrations. 
-  شرح deployment. 
-  API documentation. 
-  document important architectural decisions. 
-  استخدم ADRs للقرارات الكبيرة. 
-  document unusual business rules. 
-  لا تعتمد على معرفة شخص واحد بالمشروع. 

### Dependencies

-  قلل عدد dependencies. 
-  لا تضف library لمهمة يمكن حلها ببساطة. 
-  استخدم mature/well-maintained libraries. 
-  ثبت versions بطريقة مدروسة. 
-  راقب security vulnerabilities. 
-  احذف unused dependencies. 
-  لا تعتمد على undocumented behavior من dependency. 

### Version Control

-  commits صغيرة ومنطقية. 
-  commit messages واضحة. 
-  لا ترفع secrets. 
-  لا ترفع generated/build files بلا حاجة. 
-  استخدم branches/PR workflow مناسب. 
-  code review للتغييرات المهمة. 
-  لا تدمج code broken. 
-  history يبقى مفهومًا قدر الإمكان. 

### Code Review

-  راجع correctness. 
-  راجع readability. 
-  راجع security. 
-  راجع tests. 
-  راجع performance عند الحاجة. 
-  راجع duplication. 
-  راجع architecture. 
-  راجع edge cases. 
-  لا تجعل review مجرد style comments يستطيع linter اكتشافها. 

### Deployment & Infrastructure

-  Infrastructure as Code عندما يكون مناسبًا. 
-  environments قابلة لإعادة الإنشاء. 
-  containers تكون minimal. 
-  لا تشغل التطبيق كـ root بدون حاجة. 
-  ضع resource limits. 
-  راقب CPU/RAM/disk. 
-  استخدم autoscaling عند الحاجة. 
-  ضع network boundaries. 
-  افصل public/private resources. 
-  لا تفتح ports بلا ضرورة. 

### Backup & Disaster Recovery

-  backup ليس كافيًا بدون restore testing. 
-  حدد RPO. 
-  حدد RTO. 
-  احتفظ بنسخ متعددة عند أهمية البيانات. 
-  encrypt backups. 
-  اختبر disaster scenarios. 
-  وثّق recovery process. 

### Data Consistency

-  حدد source of truth. 
-  operations الحرجة atomic. 
-  لا تسمح inconsistent intermediate states. 
-  استخدم unique constraints حيث يلزم. 
-  duplicate requests لا تنتج duplicate data. 
-  reconciliation processes للأنظمة الموزعة عند الحاجة. 

### API / Request Resilience

-  timeout. 
-  retry. 
-  exponential backoff. 
-  jitter. 
-  rate limiting. 
-  circuit breaker. 
-  idempotency. 
-  request validation. 
-  response validation. 
-  graceful degradation. 

### Cost Efficiency

-  راقب تكلفة infrastructure. 
-  راقب API costs. 
-  راقب database costs. 
-  راقب storage growth. 
-  cache العمليات المكلفة عندما يكون منطقيًا. 
-  لا تستخدم resources أكبر من الحاجة. 
-  استخدم autoscaling بدل overprovisioning عندما يكون مناسبًا. 
-  ضع quotas/budgets/alerts للتكلفة. 
-  الأداء الأفضل لا يعني دائمًا زيادة الموارد. 

### AI/LLM Applications

إذا كان المشروع يحتوي AI:

-  افصل LLM layer عن core application. 
-  لا تجعل prompt hardcoded في عشرات الأماكن. 
-  version prompts. 
-  version models. 
-  سجل model/provider/version المستخدم. 
-  ضع structured outputs. 
-  validate model outputs. 
-  لا تثق بنتيجة LLM مباشرة. 
-  ضع deterministic validation بعد LLM. 
-  استخدم retries بشكل مدروس. 
-  ضع fallback models عند الحاجة. 
-  راقب token usage. 
-  راقب latency. 
-  راقب cost. 
-  قيّم hallucination. 
-  قيّم grounding. 
-  قيّم task success. 
-  استخدم evaluation datasets ثابتة. 
-  اعمل regression evaluation عند تغيير model/prompt. 
-  احمِ من prompt injection. 
-  لا تسمح للنموذج بتنفيذ actions حساسة بدون permission checks. 
-  tools يجب أن تحتوي schemas صارمة. 
-  validate tool arguments قبل التنفيذ. 
-  طبق least privilege على tools. 
-  ضع human approval للعمليات الخطرة. 
-  اعمل tracing لكل agent/tool call. 
-  ضع max iterations. 
-  ضع timeouts. 
-  ضع termination conditions واضحة. 
-  امنع infinite agent loops. 
-  memory يجب ألا تخلط بيانات المستخدمين. 
-  RAG يجب أن يحترم permissions. 
-  retrieved documents لا تعامل كتعليمات موثوقة تلقائيًا. 
-  وفر citations/grounding عندما يكون مطلوبًا. 
-  قيّم retrieval منفصلًا عن generation. 

### RAG

-  document ingestion pipeline واضح. 
-  تنظيف البيانات قبل indexing. 
-  chunking strategy مناسبة. 
-  metadata غنية. 
-  embeddings مناسبة للدومين. 
-  hybrid search عند الحاجة. 
-  metadata filtering. 
-  reranking. 
-  query rewriting عند الحاجة. 
-  context deduplication. 
-  لا ترسل irrelevant chunks للنموذج. 
-  ضع context budget. 
-  قيّم Recall\@K / Precision\@K أو metrics مناسبة. 
-  قيّم answer faithfulness. 
-  citations مرتبطة فعليًا بالمصدر. 
-  document updates تنعكس على index. 
-  document deletion يحذف embeddings المرتبطة. 
-  access-control filtering قبل retrieval. 

### Agentic Systems

-  كل Agent له responsibility واضحة. 
-  لا تستخدم multi-agent عندما single-agent يكفي. 
-  tools contracts واضحة. 
-  state schema واضح. 
-  termination conditions واضحة. 
-  retries محدودة. 
-  recovery strategy. 
-  checkpointing عند workflows الطويلة. 
-  verification قبل اعتبار المهمة مكتملة. 
-  human-in-the-loop عند القرارات الحساسة. 
-  audit trail. 
-  deterministic logic للعمليات التي لا تحتاج AI. 
-  لا تجعل LLM يقرر ما يمكن تحديده بقواعد deterministic. 
-  agents لا تحصل على صلاحيات أكثر من المطلوب. 

### Quality Gates

لا تعتبر feature مكتملة حتى:

-  تعمل وظيفيًا. 
-  الكود readable. 
-  لا يوجد duplication غير ضروري. 
-  architecture سليمة. 
-  validation موجود. 
-  error handling موجود. 
-  security محسوبة. 
-  tests موجودة. 
-  edge cases مجربة. 
-  logging موجود. 
-  monitoring متوفر إذا كانت production-critical. 
-  documentation محدثة. 
-  performance مقبول. 
-  accessibility محسوبة. 
-  لا توجد secrets. 
-  لا توجد known critical vulnerabilities. 
-  build ينجح. 
-  CI ينجح. 
-  deployment قابل للـ rollback. 

### أهم قاعدة للـ Agent

- **لا تكتفِ بأن تجعل المشروع "يعمل". ابنِه كما لو أن آلاف أو ملايين المستخدمين سيستخدمونه، ومطورين آخرين سيقومون بصيانته لسنوات.** 
- **Prioritize: Correctness → Security → Reliability → Maintainability → Simplicity → Performance → Scalability.** 
-  لا تضحي بالبساطة من أجل architecture مبالغ فيها. 
-  لا تضحي بالـ correctness من أجل السرعة. 
-  لا تضحي بالأمان من أجل convenience. 
-  لا تعمل optimization بدون measurement. 
-  لا تعمل abstraction بدون سبب. 
-  لا تعمل scalability engineering قبل معرفة bottleneck، لكن لا تصمم النظام بطريقة تمنع scaling مستقبلًا. 
-  كل قرار هندسي كبير يجب أن يكون له سبب واضح وقابل للدفاع عنه.
