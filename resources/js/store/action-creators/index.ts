import {UserActionCreators} from './userActionCreators'
import {BuildingActionCreators} from './buildingActionCreators'
import {TagActionCreators} from './tagActionCreators'
import {DeveloperActionCreators} from './developerActionCreators'
import {DocumentActionCreators} from './documentActionCreators'
import {ArticleActionCreators} from './articleActionCreators'
import {NotificationActionCreators} from './notificationActionCreators'
import {CompilationActionCreators} from './compilationActionCreators'
import {SettingActionCreators} from './settingActionCreators'
import {WidgetActionCreators} from './widgetActionCreators'
import {PartnerActionCreators} from './partnerActionCreators'
import {QuestionActionCreators} from './questionActionCreators'
import {PostActionCreators} from './postActionCreators'
import {BusinessProcessActionCreators} from './businessProcessCreators'
import {AgentActionCreators} from './agentActionCreators'
import {StoreActionCreators} from './storeActionCreators'

export default {
    ...UserActionCreators,
    ...BuildingActionCreators,
    ...TagActionCreators,
    ...DeveloperActionCreators,
    ...DocumentActionCreators,
    ...ArticleActionCreators,
    ...NotificationActionCreators,
    ...CompilationActionCreators,
    ...SettingActionCreators,
    ...WidgetActionCreators,
    ...PartnerActionCreators,
    ...QuestionActionCreators,
    ...PostActionCreators,
    ...BusinessProcessActionCreators,
    ...AgentActionCreators,
    ...StoreActionCreators
}
