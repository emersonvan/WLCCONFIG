export const sampleConfig = `show running-config
Building configuration...

Current configuration:
!
version 17.6
service timestamps debug datetime msec
service timestamps log datetime msec
service password-encryption
!
hostname WLC-9800
!
wlan Corporate-Main 1
 security wpa2
 security ft disable
 no security pmf
 no security wpa3
 aaa-override
 nac
 radio policy
 session-timeout 1800
 wlan-id 1
 wlan-profile-name Corporate-Main
 service-policy input platinum-up
 service-policy output platinum
!
wlan Guest-Network 2
 security wpa2
 security wpa2 psk ascii 7 123456789
 no security pmf
 no security wpa3
 session-timeout 3600
 wlan-id 2
 wlan-profile-name Guest-Network
 service-policy input bronze-up
 service-policy output bronze
!
rf-profile High-Density
 description "High Density Areas"
 data-rates 802.11a mandatory 6
 data-rates 802.11a supported 9 12 18 24 36 48 54
 tx-power-min 10
 tx-power-max 17
 coverage-hole-detection enable
 coverage level global 2
 client-network-preference default
!
rf-profile Standard-Office
 description "Standard Office Areas"
 data-rates 802.11a mandatory 12
 data-rates 802.11a supported 18 24 36 48 54
 tx-power-min 8
 tx-power-max 20
 coverage-hole-detection enable
 coverage level global 3
!
flexconnect group Branch-Office-1
 primary controller 192.168.1.10
 secondary controller 192.168.1.11
 aps count: 5
!
flexconnect group Branch-Office-2
 primary controller 192.168.1.12
 secondary controller 192.168.1.13
 aps count: 3
 shutdown
!
ap group Floor-1
 description "First Floor Access Points"
 rf-profile High-Density
 site-tag HQ-Site
 policy-tag Corporate-Policy
 aps count: 10
!
ap group Floor-2
 description "Second Floor Access Points"
 rf-profile Standard-Office
 site-tag HQ-Site
 policy-tag Corporate-Policy
 aps count: 8
!
policy-profile Employee-Access
 aaa-override
 accounting-list employee-acct
 nac
 vlan 100
 qos-policy platinum
!
policy-profile Guest-Access
 web-auth
 accounting-list guest-acct
 vlan 200
 qos-policy bronze
!
policy-tag Corporate-Policy
 description "Corporate Policy Set"
 wlan Corporate-Main policy Employee-Access
 wlan Guest-Network policy Guest-Access
!
end`;
