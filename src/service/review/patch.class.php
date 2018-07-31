<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\review;
use cenozo\lib, cenozo\log, magnolia\util;

class patch extends \cenozo\service\patch
{
  /**
   * Extend parent method
   */
  public function validate()
  {
    parent::validate();

    $data = $this->get_file_as_array();
    if( array_key_exists( 'recommendation', $data ) && 'Revise' == $data['recommendation'] )
    {
      // make sure not to allow second reviews being set to "revise"
      $db_review_type = $this->get_leaf_record()->get_review_type();
      if( 'Second Chair' == $db_review_type->name || 'Second SMT' == $db_review_type->name )
      {
        $this->status->set_code( 306 );
        $this->set_data( 'Second reviews cannot be set to "Revise".' );
      }
    }
  }
}
