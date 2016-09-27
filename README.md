# droidcon
Android Drawable Material Icon Downloader | Unpack icons from command line 

***

While working on android, you need to download icons from `https://design.google.com/icons`, select your icon, choose size and color and then download zip file. Once zip file is downloaded, you need to extract in right folder, copy icons from `android` folder, merge it inside existing drawables and delete zip file.

Well, **droidcon** will make your life simpler. Install droidcon globally on npm

```
npm install -g droidcon
```

open command window from your android `res` folder where `drawable` folder is.

use following command to download and extract icons

```
droidcon --name delete-forever --size 18dp --color black
```

> default icon is delete forever, default size is 18dp and default color is black
>
> name of the icon can be found on `https://design.google.com/icons`. Replace space in the name with dash, ex. delete forever => delete-forever
>
> size can be written as `24` or `24dp` style. You can also find sizes on above link when you click a icon.

**Above command will download and unpack icons automatically and clean up download files.**