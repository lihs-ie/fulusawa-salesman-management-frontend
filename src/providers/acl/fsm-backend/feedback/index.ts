import { Adaptor, Reader, Translator, Writer } from 'acl/fsm-backend/feedback/delegate';
import {
  Adaptor as BaseAdaptor,
  Reader as BaseReader,
  Writer as BaseWriter,
  Translator as BaseTranslator,
} from 'acl/fsm-backend/feedback/templates';
import { acl } from 'config';
import { container } from 'providers/container';

container.bind(BaseReader).to(Reader);
container.bind(BaseWriter).to(Writer);
container.bind(BaseTranslator).to(Translator);
container.bind(BaseAdaptor).toDynamicValue((context) => {
  const endpoint = acl['fcm-backend'].API_ENDPOINT;
  const writer = context.container.get(BaseWriter);
  const reader = context.container.get(BaseReader);
  const translator = context.container.get(BaseTranslator);

  return new Adaptor(endpoint, writer, reader, translator);
});
