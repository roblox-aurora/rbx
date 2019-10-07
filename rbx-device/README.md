# Device

A utility to get device information.

Useful for knowing what controls to assign to a user, or a custom experience/UI per platform/device.

## GetPlatformType()

Returns the platform type

- `console` - Is XBox 
- `desktop` - Is Windows or MacOS 
- `tablet` - Is iOS or Android tablet 
- `phone` Is iOS or Android phone


## GetAspectRatio
Gets the aspect ratio of the screen

Returns an array of two numbers, e.g. a 1920x1080 screen will give you `[16, 9]`