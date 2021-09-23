[![Lint Code Base](https://github.com/aviarytech/wacinsteins-monster/actions/workflows/super-linter.yml/badge.svg)](https://github.com/aviarytech/wacinsteins-monster/actions/workflows/super-linter.yml)
# Wacinstein's Monster

This project contains an end to end waci-pex implementation

This project uses the nestjs library as a web server and stores everything in memory (including private keys).. It is meant for development purposes only. Any other use is strictly prohibited.

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

UML
@startuml
actor Alice as a
participant AV1A as av1a
participant AV1B as av1b
actor Bob as b

a -> av1a : Create Request
av1a -> av1b : DIDComm Message\n\
 Present Proof v3 - Request\n\
 Presentation Exchange Definition
av1b -> b : Display Credential Selector
b -> av1b : Submit Selectively Disclosed attributes
av1b -> av1a : DIDComm Message\n\
 Present Proof v3 - Presentation\n\
 Presentation Exchange Submission
av1a -> a : Display Verified Data
@enduml
