# Samsung S6 Notes

## Practical device notes
- Confirm Android version and WebView/Chrome currency first.
- If this is a Galaxy Tab S6, modern PWA and web rendering should be viable.
- If this is an older Galaxy S6 phone-class device, browser/runtime behavior may be more constrained.

## Validate on device
- Firebase sign-in popup flow
- viewport scaling and sidebar layout
- code editor interactions
- PDF export behavior
- service worker / offline shell behavior
- memory pressure during library and navigator use

## Risk areas
- auth popup restrictions
- background tab suspension
- large DOM / navigator memory load
- file download / PDF save flow
