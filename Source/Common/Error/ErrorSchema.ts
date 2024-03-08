export enum ErrorSchema {
    NO_BODY = 'NO_BODY',
    ADDITIONAL_PROPERTIES = 'ADDITIONAL_PROPERTIES',

    EMAIL_BLACKLIST = 'EMAIL_BLACKLIST',
    EMAIL_PATTERN = 'EMAIL_PATTERN',
    EMAIL_IS_REQUIRED = 'EMAIL_IS_REQUIRED',
    EMAIL_OR_USERNAME_REQUIRED = 'EMAIL_OR_USERNAME_REQUIRED',
    
    PASSWORD_IS_REQUIRED = 'PASSWORD_IS_REQUIRED',
    PASSWORD_PATTERN = 'PASSWORD_PATTERN',
    
    USERNAME_PATTERN = 'USERNAME_PATTERN',
    USERNAME_IS_REQUIRED = 'USERNAME_IS_REQUIRED',

    ID_PATTERN = 'ID_PATTERN',
    LIMIT_PATTERN = 'LIMIT_PATTERN',

    TYPE_OBJECT = 'TYPE_OBJECT',

    OFFSET_PATTERN = 'OFFSET_PATTERN',

    $IN_ARRAY_PATTERN = '$IN_ARRAY_PATTERN',
    $NIN_ARRAY_PATTERN = '$NIN_ARRAY_PATTERN',
    $EQ_PATTERN = '$EQ_PATTERN',
    $NEQ_PATTERN = '$NEQ_PATTERN',
    $MATCH_PATTERN = '$MATCH_PATTERN',
    $LT_PATTERN = '$LT_PATTERN',
    $LTE_PATTERN = '$LTE_PATTERN',
    $GT_PATTERN = '$GT_PATTERN',
    $GTE_PATTERN = '$GTE_PATTERN',

    ROLE_PATTERN = 'ROLE_PATTERN',
    PERMISSION_PATTERN = 'PERMISSION_PATTERN',
    DATE_PATTERN = 'DATE_PATTERN',

    MUST_BE_ARRAY_OR_OBJECT = 'MUST_BE_ARRAY_OR_OBJECT',
}