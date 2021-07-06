# WACInsteins-monster

To work on end to end waci-pex implementation

This project uses the nestjs library as a web server and currently stores everything in memory (including private keys)

TODO:

- Use the link flow
- Implement DIDComm v2
  - https://didcomm.org/present-proof/3.0/propose-presentation
  - https://didcomm.org/present-proof/3.0/request-presentation
    - Including JSON-LD Frame
  - https://didcomm.org/present-proof/3.0/presentation
    - BBS+ VC
- Implement DIF Presentation Exchange
  - Presentation Definition
  - Presentation Submission

DONE:

- Use did:web to create a did with a service block that will work for DIDComm
- 
