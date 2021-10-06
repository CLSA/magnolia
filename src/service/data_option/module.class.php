<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\data_option;
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

    $modifier->join( 'data_category', 'data_option.data_category_id', 'data_category.id' );

    if( $select->has_column( 'has_condition' ) )
    {
      $select->add_column(
        'data_option.condition_en IS NOT NULL OR data_option.condition_fr IS NOT NULL',
        'has_condition',
        false
      );
    }
  }
}
