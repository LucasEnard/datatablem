import moment from 'moment-timezone';

import type { IUiSettingsClient } from '@kbn/core/public';


export function getTimeZone(uiSettings: IUiSettingsClient) {
    const configuredTimeZone = uiSettings.get('dateFormat:tz');
    if (configuredTimeZone === 'Browser') {
        return moment.tz.guess();
    }

    return configuredTimeZone;
}