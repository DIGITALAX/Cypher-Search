Cypher Search. Decentralised ecosystem search, mint, collect and fulfill.

https://cypher.digitalax.xyz/

## Order decryptor

Order fulfillment details are encrypted to the buyer's wallet key and are never decrypted on the site. Buyers download their encrypted order file from the orders page and open `public/order-decryptor.html` from their own computer to read it. The decryptor is a single self-contained file: it has no dependencies, blocks all network access through its Content-Security-Policy, and stores nothing.

SHA-256 of `public/order-decryptor.html`:

```
780a7f4a32f88f74aa8fc58de69684c3374714a91fd4fa15d873fe1cb2dcc9a9
```

Verify a downloaded copy with:

```bash
shasum -a 256 order-decryptor.html
```

When the decryptor file changes, update this checksum and `ORDER_DECRYPTOR_SHA256` in `src/app/lib/constants.ts`.