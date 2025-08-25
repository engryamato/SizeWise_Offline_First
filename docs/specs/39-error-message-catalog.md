# Error Message Catalog (Documents Only)

Maps ErrorCode → user-facing text and remediation.

| Code | Title | Message | User Action |
|------|-------|---------|-------------|
| E_INPUT_VALIDATION | Invalid Inputs | One or more inputs are out of range. | Review highlighted fields and correct values. |
| E_DB_CONSTRAINT | Couldn’t Save | The change conflicts with data constraints. | Adjust inputs or try again. |
| E_DB_CORRUPTION | Project Issue Detected | The project database appears corrupted. | We created a snapshot. Try automatic repair or restore the latest backup. |
| E_EXPORT_FORMAT | Export Invalid | Export file failed integrity/signature checks. | Re-export the project or verify file source. |
| E_IMPORT_FORMAT | Import Invalid | File format or schema version not supported. | Use a compatible .sizewise version or update the app. |
| E_SYNC_NETWORK | Network Problem | Couldn’t reach the server. | You can keep working offline; we’ll retry when online. |
| E_SYNC_CONFLICT | Sync Conflict | Changes conflict with another version. | Review both versions and choose how to merge. |
| E_LIC_INVALID | License Problem | License could not be verified. | Re-import your license or contact support. |
| E_UPDATE_VERIFY | Update Rejected | Update failed signature or verification. | Retry later or download from official release page. |
| E_SECURITY_ENCRYPTION | Encryption Error | Could not encrypt/decrypt data. | Check your passphrase and try again. |

