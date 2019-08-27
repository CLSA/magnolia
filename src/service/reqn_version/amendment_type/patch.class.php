<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn_version\amendment_type;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Special service for handling the patch meta-resource
 */
class patch extends \cenozo\service\patch
{
  /**
   * Override parent method
   */
  protected function setup()
  {
    // do nothing (we're only setting the justification to an amendment type, so this isn't the usual patch)
  }

  /**
   * Override parent method
   */
  protected function execute()
  {
    $data = $this->get_file_as_array();
    $db_amendment_type = $this->get_leaf_record();
    $db_reqn_version = $this->get_parent_record();
    $db_reqn_version->set_amendment_type_justification( $db_amendment_type->id, $data['justification'] );
  }
}
