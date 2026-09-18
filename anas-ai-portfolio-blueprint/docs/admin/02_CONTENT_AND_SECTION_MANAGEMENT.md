# Admin Content and Section Management

## Page operations
- create;
- edit;
- reorder;
- publish;
- unpublish;
- archive.

## Section operations
- add;
- rename;
- localize;
- reorder drag/drop + keyboard-accessible alternative;
- choose layout;
- add blocks;
- preview;
- publish;
- delete.

## Validation
A section cannot publish if:
- required block data invalid;
- required translations missing;
- unsafe external URL fails validation;
- referenced media missing.

## Immediate updates
After a successful publish:
- DB transaction commits;
- relevant cache tags invalidate;
- index job is queued if content is knowledge-bearing;
- public site reflects the content change without source deployment.
