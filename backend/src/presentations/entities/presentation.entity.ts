import {
  isArray,
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class InputFilter {
  @IsNotEmpty()
  @IsString()
  type: string;

  constructor(type: string) {
    this.type = type;
  }
}

export class InputField {
  @IsArray()
  path: string[];

  @IsNotEmpty()
  @ValidateNested()
  filter: InputFilter;

  constructor(path: string[], filter: InputFilter) {
    this.path = path;
    this.filter = filter;
  }
}

export class InputConstraint {
  @IsNotEmpty()
  @ValidateNested()
  fields: InputField[];

  constructor(fields: InputField[]) {
    this.fields = fields;
  }
}

export class InputDescriptor {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  schema: string;

  @IsNotEmpty()
  @ValidateNested()
  constraints: InputConstraint;

  constructor(
    id: string,
    name: string,
    schema: string,
    constraints: InputConstraint,
  ) {
    this.id = id;
    this.name = name;
    this.schema = schema;
    this.constraints = constraints;
  }
}

export class PresentationDefinition {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsObject()
  frame: object;

  @ValidateNested()
  @IsArray()
  input_descriptors: InputDescriptor[];

  constructor(id: string, frame: object, input_descriptors: InputDescriptor[]) {
    this.id = id;
    this.frame = frame;
    this.input_descriptors = input_descriptors;
  }
}

export class PresentationRequest {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  challenge: string;

  @IsNotEmpty()
  @IsString()
  domain: string;

  @IsNotEmpty()
  @ValidateNested()
  definition: PresentationDefinition;

  constructor(
    id: string,
    url: string,
    challenge: string,
    domain: string,
    definition: PresentationDefinition,
  ) {
    this.id = id;
    this.url = url;
    this.challenge = challenge;
    this.domain = domain;
    this.definition = definition;
  }
}

export class Presentation {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @ValidateNested()
  request: PresentationRequest;

  constructor(id: string, request: PresentationRequest) {
    this.id = id;
    this.request = request;
  }
}
