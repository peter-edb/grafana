import { t } from '@grafana/i18n';
import { SceneComponentProps, SceneObjectBase, SceneObjectRef, SceneObjectState, VizPanel } from '@grafana/scenes';
import { LibraryPanel } from '@grafana/schema';
import { Drawer } from '@grafana/ui';
import {
  LibraryPanelsSearch,
  LibraryPanelsSearchVariant,
} from 'app/features/library-panels/components/LibraryPanelsSearch/LibraryPanelsSearch';

import { getDashboardSceneFor, getDefaultVizPanel } from '../utils/utils';

import { LibraryPanelBehavior } from './LibraryPanelBehavior';
import { isDashboardLayoutItem } from './types/DashboardLayoutItem';

export interface AddLibraryPanelDrawerState extends SceneObjectState {
  panelToReplaceRef?: SceneObjectRef<VizPanel>;
}

export class AddLibraryPanelDrawer extends SceneObjectBase<AddLibraryPanelDrawerState> {
  public onClose = () => {
    getDashboardSceneFor(this).closeModal();
  };

  public onAddLibraryPanel = (panelInfo: LibraryPanel) => {
    const dashboard = getDashboardSceneFor(this);
    const newPanel = getDefaultVizPanel();

    newPanel.setState({
      // Panel title takes precedence over library panel title when resolving the library panel
      title: panelInfo.model.title,
      hoverHeader: !panelInfo.model.title,
      $behaviors: [new LibraryPanelBehavior({ uid: panelInfo.uid, name: panelInfo.name })],
    });

    const panelToReplace = this.state.panelToReplaceRef?.resolve();

    if (panelToReplace) {
      const layoutItem = panelToReplace.parent;

      if (layoutItem && isDashboardLayoutItem(layoutItem)) {
        // keep the same key from the panelToReplace
        // this is important for edit mode
        newPanel.setState({ key: panelToReplace.state.key });
        layoutItem.setElementBody(newPanel);
      }
    } else {
      dashboard.addPanel(newPanel);
    }

    this.onClose();
  };

  static Component = ({ model }: SceneComponentProps<AddLibraryPanelDrawer>) => {
    const title = t('library-panel.add-widget.title', 'Add panel from panel library');

    return (
      <Drawer title={title} onClose={model.onClose}>
        <LibraryPanelsSearch
          onClick={model.onAddLibraryPanel}
          variant={LibraryPanelsSearchVariant.Tight}
          showPanelFilter
        />
      </Drawer>
    );
  };
}
