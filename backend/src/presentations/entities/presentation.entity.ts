interface InputDescriptor {
  id: string;
  name: string;
  schema: string;
  contraints: { fields: { path: string[]; filter: { type: string } }[] };
}

interface PresentationDefinition {
  id: string;
  frame: object;
  input_descriptors: InputDescriptor[];
}

interface PresentationRequest {
  id: string;
  url: string;
  challenge: string;
  domain: string;
  definition: PresentationDefinition;
}

export interface Presentation {
  id: string;
  request: PresentationRequest;
}
