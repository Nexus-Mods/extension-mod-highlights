import HighlightButton from './views/HighlightButton';
import TextareaNotes from './views/TextareaNotes';

import * as path from 'path';
import * as React from 'react';
import { selectors, tooltip, types, util } from 'vortex-api';

function init(context: types.IExtensionContext) {
  context.registerTableAttribute('mods', {
    id: 'notes',
    description: 'Mod Notes',
    icon: 'sticky-note',
    placement: 'detail',
    supportsMultiple: true,
    customRenderer: (mods: types.IMod[]) => {
      const gameMode = selectors.activeGameId(context.api.store.getState());
      return (<TextareaNotes gameMode={gameMode} mods={mods} />);
    },
    calc: (mod: types.IMod) => util.getSafe(mod.attributes, ['notes'], ''),
    isToggleable: false,
    edit: {},
    isSortable: false,
  });

  context.registerTableAttribute('mods', {
    id: 'modHighlight',
    name: 'Highlight',
    description: 'Mod Highlight',
    icon: 'lightbulb-o',
    placement: 'table',
    customRenderer: (mod: types.IMod) => {
      const note = util.getSafe(mod.attributes, ['notes'], undefined);
      return (
        <div className='highlight-container'>
          {((note !== undefined) && (note.length > 0))
            ? <tooltip.Icon tooltip={note} name='changelog' />
            : null}
          <HighlightButton mod={mod} />
        </div>
      );
    },
    calc: (mod: types.IMod) =>
      util.getSafe(mod.attributes, ['icon'], '')
      + ' - ' + util.getSafe(mod.attributes, ['color'], '')
      + ' - ' + util.getSafe(mod.attributes, ['notes'], ''),
    isToggleable: true,
    edit: {},
    isSortable: true,
    isDefaultVisible: false,
  });

  context.once(() => {
    context.api.setStylesheet('mod-highlight', path.join(__dirname, 'mod-highlight.scss'));
  });

  return true;
}

export default init;
