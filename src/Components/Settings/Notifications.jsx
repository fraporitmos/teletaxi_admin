import React, { useState } from 'react'
import SettingSection from './SettingSection'
import { Bell } from 'lucide-react'
import ToggleSwitch from './ToggleSwitch'


function Notifications() {
    const [notifications, setNotifications] = useState({
        push: true,
        email: false,
        sms: true,
    });
    return (
        <SettingSection icon={Bell} title={"Notifications"}>
            <ToggleSwitch
                label={"Push Notifications"}
                isOn={notifications.push}
                onToggle={() => setNotifications({ ...notifications, push: !notifications.push })}
            />

            <ToggleSwitch
                label={"Push Notifications"}
                isOn={notifications.email}
                onToggle={() => setNotifications({ ...notifications, push: !notifications.push })}
            />

            <ToggleSwitch
                label={"Push Notifications"}
                isOn={notifications.sms}
                onToggle={() => setNotifications({ ...notifications, push: !notifications.push })}
            />

        </SettingSection>
    )
}

export default Notifications