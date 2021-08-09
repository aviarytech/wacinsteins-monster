import { flatten } from '@nestjs/common';

export const mapValidationErrorsToMessages = (e) => {
  return e.map((error) => {
    let msgs = [];
    if (error.children.length > 0) {
      const childrenMessages = mapValidationErrorsToMessages(error.children);
      msgs.push(...childrenMessages);
    } else {
      const messages = Object.keys(error.constraints).map((k) => {
        return error.constraints[k];
      });
      msgs.push(...messages);
    }
    return flatten(msgs).join(', ');
  });
};
