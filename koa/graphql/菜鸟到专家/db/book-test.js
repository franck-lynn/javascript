

import {books} from './books';

import { find, propEq } from 'ramda';

console.log(
    find(propEq('id', 2))(books)
)

