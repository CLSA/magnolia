<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\manuscript_review_type;
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

    // add a list of roles
    if( $select->has_column( 'role_list' ) )
      $this->add_list_column( 'role_list', 'role', 'name', $select, $modifier );

    // add the total number of manuscript_reviews
    if( $select->has_column( 'manuscript_review_count' ) )
      $this->add_count_column( 'manuscript_review_count', 'manuscript_review', $select, $modifier );
  }
}
