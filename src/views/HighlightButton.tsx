import * as React from 'react';
import { Button, ControlLabel, FormGroup, Overlay, Popover } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { actions, ComponentEx, Icon, selectors, tooltip, types, util } from 'vortex-api';
import { ThunkDispatch } from 'redux-thunk';

const cssHighlightList: string[] = [
  'highlight-1',
  'highlight-2',
  'highlight-3',
  'highlight-4',
  'highlight-5',
  'highlight-6',
  'highlight-7',
  'highlight-8',
  'highlight-default',
];

export interface IBaseProps {
  mod: types.IMod;
}

interface IActionProps {
  onSetModAttribute: (gameMode: string, modId: string, attributeId: string, value: any) => void;
}

interface IConnectedProps {
  gameMode: string;
}

type IProps = IBaseProps & IConnectedProps & IActionProps;

interface IComponentState {
  showOverlay: boolean;
}

/**
 * Highlight Button
 *
 * @class HighlightButton
 */
class HighlightButton extends ComponentEx<IProps, IComponentState> {
  private mRef: tooltip.IconButton;

  constructor(props: IProps) {
    super(props);

    this.initState({ showOverlay: false });
  }

  public render(): JSX.Element {
    const { mod, t } = this.props;

    if (mod.state !== 'installed') {
      return null;
    }

    const color = util.getSafe(mod.attributes, ['color'], '');
    const icon = util.getSafe(mod.attributes, ['icon'], '');

    const modIcon: string[] = [
      'highlight-conflict',
      'highlight-patch',
      'highlight-shield',
      'highlight-map',
      'highlight-lab',
      'highlight-flag',
      'highlight-temple',
      'highlight-home',
      'highlight-person',
      'highlight-visuals',
      'highlight'];

    const popoverBottom = this.state.showOverlay ? (
      <Popover
        id='popover-highlight-settings'
        title={t('Highlight Settings')}
      >
        <FormGroup key={mod.id}>
          <ControlLabel>{t('Select theme')}
          </ControlLabel>
          <div key='dialog-form-colors'>
            {cssHighlightList.map((highlightColor) => {
              return this.renderHighlightColor(highlightColor);
            })}
          </div>
          <ControlLabel>{t('Select mod icon')}
          </ControlLabel>
          <div className='highlight-icons'>
            {modIcon.map(this.renderIcons)}
          </div>
        </FormGroup>
      </Popover>
    ) : null;

    return (
      <div style={{ textAlign: 'center' }}>
        {this.state.showOverlay ? (
          <Overlay
            rootClose
            placement='bottom'
            onHide={this.toggleOverlay}
            show={this.state.showOverlay}
            target={this.mRef as any}
          >
            {popoverBottom}
          </Overlay>
        ) : null}
        <tooltip.IconButton
          ref={this.setRef}
          className={'highlight-base ' + (color !== '' ? color : 'highlight-default')}
          icon={icon !== '' ? icon : 'highlight'}
          id={mod.id}
          tooltip={t('Change Icon')}
          onClick={this.toggleOverlay}
        />
      </div>
    );
  }

  private renderHighlightColor(highlightColor: string): JSX.Element {
    return (
      <Button
        type='button'
        key={highlightColor}
        className={'highlight-base ' + highlightColor}
        id={highlightColor}
        value={highlightColor}
        onClick={this.toggleColors}
      >
        <Icon name={highlightColor === 'highlight-default' ? 'remove' : 'add'} />
      </Button>
    );
  }

  private renderIcons = (icon: string) => {
    return (
      <Button
        type='button'
        key={icon}
        className='btn-embed'
        id={icon}
        value={icon}
        onClick={this.toggleIcon}
      >
        <Icon name={icon} />
      </Button>
    );
  }

  private toggleIcon = (evt) => {
    const { gameMode, mod, onSetModAttribute } = this.props;
    onSetModAttribute(gameMode, mod.id, 'icon', evt.currentTarget.id);
  }

  private toggleColors = (color) => {
    const { gameMode, mod, onSetModAttribute } = this.props;
    onSetModAttribute(gameMode, mod.id, 'color', color.currentTarget.value);
  }

  private setRef = (ref: tooltip.IconButton) => {
    this.mRef = ref;
  }

  private toggleOverlay = () => {
    this.nextState.showOverlay = !this.state.showOverlay;
  }
}

function mapStateToProps(state: types.IState): IConnectedProps {
  return {
    gameMode: selectors.activeGameId(state),
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<any, any, any>): IActionProps {
  return {
    onSetModAttribute: (gameMode: string, modId: string, attributeId: string, value: any) => {
      dispatch(actions.setModAttribute(gameMode, modId, attributeId, value));
    },
  };
}

export default
  withTranslation(['common'])(
    connect(mapStateToProps, mapDispatchToProps)(
      HighlightButton) as any) as React.ComponentClass<IBaseProps>;
