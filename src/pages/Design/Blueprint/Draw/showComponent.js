import * as Placeholder from './NormalComponents/Placeholder';
import BT from './DesignComponents/BT/index';

export function showComponent(name, param) {
  switch (name) {
    case BT.config.name:
      return <BT.Show {...param} />;

    case Placeholder.config.name:
      return <Placeholder.Placeholder {...param} />;

    default:
      return null;
  }
}
