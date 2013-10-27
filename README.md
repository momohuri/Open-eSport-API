Open-eSport-API
===============

What is it ?
------------

Open eSport API is a node project which works as a RSS feeder. It gather articles from esports websites in a MongoDB and provide it through an API.
This app is working with 10 websites (4 english and 6 french) :
- Reddit
- TeamLiquid
- Cadred
- HLTV
- O'Gaming
- Team aAa
- Millenium
- eSportsFrance
- VaKarM
- In eSport We Trust


How to use it ?
---------------

Open eSport API provide JSON arrays

<pre>/lang/:lang</pre>
Articles from a language

<pre>/website/:website</pre>
Articles from a website

<pre>/game/:game</pre>
Articles with a specific game

<pre>/duo/:website/:game</pre>
Articles from a website with a specific game

<pre>/posts/all/</pre>
All articles


Licence
-------

The MIT License (MIT)

Copyright (c) 2013 Antoine Rivière

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
