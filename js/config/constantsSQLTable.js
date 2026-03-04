// Global constants for SQL tables used in SQLtask

export const SQLTable_1 = {
    type: 'table',
    name: 'system',
    content: 
        [ 
        {id: 0, name: 'Admin', email: 'supreme.leader@regime.gov'},
        {id: 1, name: 'Alice', email: 'a.smith@regime.gov'}, 
        {id: 2, name: 'Bob', email: 'b.jones@regime.gov'},
        {id: 3, name: 'Charlie', email: 'c.miller@regime.gov'},
        {id: 4, name: 'Diana', email: 'd.brown@regime.gov'},
        {id: 5, name: 'Eve', email: 'e.wilson@regime.gov'},
        {id: 6, name: 'Frank', email: 'f.davis@regime.gov'},
        {id: 7, name: 'John', email: 'g.john@regime.gov'},
        ]
};

export const SQLTable_2 = {
    type: 'table',
    name: 'system',
    content: 
        [ 
        {id: 0, name: 'Admin', key: 'alpha123'},
        {id: 1, name: 'Alice', key: 'bravo456'},
        {id: 2, name: 'Bob', key: 'charlie789'},
        {id: 3, name: 'Charlie', key: 'delta012'},
        {id: 4, name: 'Diana', key: 'echo345'},
        {id: 5, name: 'Eve', key: 'foxtrot678'},
        {id: 6, name: 'Frank', key: 'golf901'},
        {id: 7, name: 'John', key: 'hotel234'},
        {id: 8, name: 'Heidi', key: 'india567'},
        {id: 9, name: 'Ivan', key: 'juliet890'},
        {id: 10, name: 'Judy', key: 'kilo123'},
        {id: 11, name: 'Mallory', key: 'lima456'},
        {id: 12, name: 'Oscar', key: 'mike789'},
        {id: 13, name: 'Peggy', key: 'november012'},
        {id: 14, name: 'Trent', key: 'oscar345'},
        {id: 15, name: 'Victor', key: 'papa678'},
        {id: 16, name: 'Walter', key: 'quebec901'},
        {id: 17, name: 'Sybil', key: 'romeo234'},
        {id: 18, name: 'Trudy', key: 'sierra567'},
        {id: 19, name: 'Eve', key: 'tango890'},
        {id: 20, name: 'Frank', key: 'uniform123'},
        {id: 21, name: 'Grace', key: 'victor456'},
        {id: 22, name: 'Heidi', key: 'whiskey789'},
        {id: 23, name: 'Ivan', key: 'xray012'},
        {id: 24, name: 'Judy', key: 'yankee345'},
        {id: 25, name: 'Mallory', key: 'zulu678'},
        {id: 26, name: 'Oscar', key: 'alpha901'},
        {id: 27, name: 'Peggy', key: 'bravo234'},
        {id: 28, name: 'Trent', key: 'charlie567'},
        {id: 29, name: 'Victor', key: 'delta890'},
        {id: 30, name: 'Walter', key: 'echo123'},
        {id: 31, name: 'Sybil', key: 'foxtrot456'},
        ]
};

export const SQLTable_3 = {
    type: 'dbase',
    name: 'data',
    children: {
        'sys': {
        type: 'table',
        name: 'sys',
        content: 
            [ 
            {id: 0, name: 'Admin', key: 'alph'},
            {id: 1, name: 'Alice', key: 'brav'},
            {id: 2, name: 'Bob', key: 'char'},
            {id: 3, name: 'Charlie', key: 'delt'},
            {id: 4, name: 'Diana', key: 'echo'},
            {id: 5, name: 'Eve', key: 'foxt'},
            {id: 6, name: 'Frank', key: 'golf'},
            {id: 7, name: 'John', key: 'hotl'},
            {id: 8, name: 'Heidi', key: 'indi'},
            {id: 9, name: 'Ivan', key: 'juli'},
            {id: 10, name: 'Judy', key: 'kilo'},
            {id: 11, name: 'Mallory', key: 'lima'},
            {id: 12, name: 'Oscar', key: 'mike'},
            {id: 13, name: 'Peggy', key: 'nove'},
            {id: 14, name: 'Trent', key: 'osca'},
            {id: 15, name: 'Victor', key: 'papa'}
            ]
        },
        'tem': {
        type: 'table',
        name: 'tem',
        content:
            [ 
            {id: 0, name: 'Admin', key: 'a123'},
            {id: 1, name: 'Alice', key: 'b456'},
            {id: 2, name: 'Bob', key: 'c789'},
            {id: 3, name: 'Charlie', key: 'd012'},
            {id: 4, name: 'Diana', key: 'e345'},
            {id: 5, name: 'Eve', key: 'f678'},
            {id: 6, name: 'Frank', key: 'g901'},
            {id: 7, name: 'John', key: 'h234'},
            {id: 8, name: 'Heidi', key: 'i567'},
            {id: 9, name: 'Ivan', key: 'j890'},
            {id: 10, name: 'Judy', key: 'k123'},
            {id: 11, name: 'Mallory', key: 'l456'},
            {id: 12, name: 'Oscar', key: 'm789'},
            {id: 13, name: 'Peggy', key: 'n012'},
            {id: 14, name: 'Trent', key: 'o345'},
            {id: 15, name: 'Victor', key: 'p678'}
            ]
        }
     },
};