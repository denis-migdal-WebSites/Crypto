State
=====

State: [UI] / [COMP]

1:
2: COMP
3: COMP
4: COMP
5: COMP
6: Problème
7:

Desc exercices
==============

2: Chiffrer
-----------

- Exercice: chiffrer à partir de la table de correspondance.
- Donné:
    - Texte brute
    - Table de correspondance (chiffrement césar 5).

3: Déchiffrer
-------------

- Exercice: déchiffrer à partir de la table de correspondance.
- Donné:
    - Texte chiffré.
    - Table de correspondance (chiffrement césar 5).

4: Changer clef
---------------

- Exercice: changer la clef et observer le résultat.
- Donné:
    - Table de chiffrement + navigateur (< 1/26 >)
    - Texte.

5: Casser clef
---------------

- Exercice: changer la clef et trouver le texte original.
- Donné:
    - Table de déchiffrement + navigateur (< 1/26 >)
    - Texte à trouver.

6: FreqAtk
----------

- Exercice: effectuer une attaque par fréquence sur un texte donné.
- Donné:
    - table de fréquence FR
    - table de fréquence du texte
    - table de conversion à remplir
    - question (résultat).

-> ne marche pas très bien.
    -> besoin de tester des hypothèses et d'avoir un dictionnaire.
    -> besoin de trouver les combinaisons de lettres interdites.
    -> tester mots courts / fréquence digraphes/trigraphes.
    -> double caractères, etc.
    => donner les 5 premières lettres ?

Desc scénario
=============

- communication, Alice / Bob, Charlie espionne.
- on ne veut pas qu'il puisse lire
- <b>solution</b>: remplacer les lettres par une autre (e.g. A remplacé par B).
- [exo] pouvez-vous lire ?

- chiffrer/déchiffer/décrypter.
- table de correspondance.
- [exo] décoder puis encoder.

- plusieurs systèmes pour créer la table, e.g. césar avec décallage.
- [exo] changer la clef (chiffrer)
- [exo] casser la clef (brute force, tester toutes les possibilités).

- autres systèmes, pas pour autant sécure, attaque par freq.
- [exo] atk par freq.

- one timepad ~= une table de correspondance différente pour chaque caractère.
- pour simplifier un décalage différent pour chaque caractère.
    Clef = [2,3,4,5,25,34]
- [exo] encoder
- [exo] vous arrivez à casser ?

======================================================================