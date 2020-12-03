import { DirectionCSS } from './StyleSettingsComponents/DirectionCSS';
import { NormalSetValue } from './StyleSettingsComponents/NormalSetValue';
import { NormalSwitch } from './StyleSettingsComponents/NormalSwitch';
import { Background } from './StyleSettingsComponents/Background';
import Input from './DataSettingsComponents/Input';
import LinkSelector from './MethodSettingsComponents/LinkSelector';
import { settingsType } from './data/types';

export function settingsComponent(prop, param) {
  console.log(prop, param);
  switch (prop) {
    case 'borderWidth':
    case 'borderStyle':
    case 'borderColor':
    case 'margin':
    case 'padding':
    case 'borderRadius':
      return <DirectionCSS {...param} />;
    case 'width':
    case 'height':
      return <NormalSetValue {...param} />;
    case 'textAlign':
      return <NormalSwitch {...param} />;
    case settingsType.input:
      return <Input {...param} />;

    case 'background':
      return <Background {...param} />;

    case 'click':
      return <LinkSelector {...param} />;

    default:
      return null;
  }
}
