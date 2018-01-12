<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\qnaire_type;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    if( $select->has_column( 'replacements' ) )
    {
      $modifier->join( 'qnaire', 'qnaire_type.id', 'qnaire.qnaire_type_id' );
      $modifier->group( 'qnaire_type.rank' );
      $select->add_column(
        'GROUP_CONCAT( IFNULL( qnaire.replacement, "" ) ORDER BY qnaire.cohort SEPARATOR "|" )',
        'replacements',
        false
      );
    }
  }
}
