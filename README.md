[![Lint Code Base](https://github.com/aviarytech/wacinsteins-monster/actions/workflows/super-linter.yml/badge.svg)](https://github.com/aviarytech/wacinsteins-monster/actions/workflows/super-linter.yml)
# Alpha Wacinstein's Monster

This project contains an end to end waci-pex implementation

This project uses the nestjs library as a web server and stores everything in a mongodb (including private keys).. It is meant for development purposes only. Any other use is strictly prohibited.

Included:
- DIDComm v2
  - https://didcomm.org/present-proof/3.0/propose-presentation
  - https://didcomm.org/present-proof/3.0/request-presentation
    - Including JSON-LD Frame
  - https://didcomm.org/present-proof/3.0/presentation
    - BBS+ VC
  - https://didcomm.org/basicmessage/2.0/message
  - https://didcomm.org/out-of-band/2.0
  - https://didcomm.org/trust-ping/2.0

- DIF Presentation Exchange
  - Presentation Definition
  - Presentation Submission

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
