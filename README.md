# 1cent 1.0

A Google Chrome extension for making automatic 1-cent donations to your favorite websites.

https://chrome.google.com/webstore/detail/cmllelopgpiedniklaifmljhfnkjdefn

## How it works

Publishers include the following meta tag in their HTML pages:

```html
<meta name="bitcoin" content="1Nix3y41o...">
```

When you install the extension, you specify your Bitcoin private key in the settings. From then on, anytime you visit a website that accepts Bitcoin donations (see meta tag above), 1cent automatically makes a $0.01 donation on your behalf.

A few things to note:

 1.  WARNING: Your private key is stored _in the clear_ (not encrypted!). It is best you [create a new address][2] for this purpose and transfer a very small amount of coin to the new address.
 2.  If you visit the same website multiple times in a 24-hour period, only one donation will be made.
 3.  A donation is made only if you've spent a minute or more on the page.
 4.  For security reasons, only HTTPS websites are considered for donations.
 5.  The price of a cent is based on Blockchain's [Exchange Rates API][1].

[1]:https://blockchain.info/api/exchange_rates_api
[2]:https://www.bitaddress.org/bitaddress.org-v2.9.8-SHA256-2c5d16dbcde600147162172090d940fd9646981b7d751d9bddfc5ef383f89308.html

